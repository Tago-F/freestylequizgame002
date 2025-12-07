package com.tagoapp.backend.service;

import com.tagoapp.backend.dto.AnswerResult;
import com.tagoapp.backend.dto.GenerateQuizRequest;
import com.tagoapp.backend.dto.QuizResponse;
import com.tagoapp.backend.model.GameSession;
import com.tagoapp.backend.model.GameStatus;
import com.tagoapp.backend.model.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {

    private final Map<String, GameSession> sessions = new ConcurrentHashMap<>();
    private final QuizService quizService;

    @Autowired
    public GameService(QuizService quizService) {
        this.quizService = quizService;
    }

    public String createSession(GenerateQuizRequest settings) {
        String sessionId = UUID.randomUUID().toString();
        GameSession session = new GameSession(sessionId, settings);
        sessions.put(sessionId, session);
        return sessionId;
    }

    public Player joinSession(String sessionId, String playerName, String icon) {
        GameSession session = sessions.get(sessionId);
        if (session == null) {
            throw new IllegalArgumentException("Session not found: " + sessionId);
        }

        String playerId = UUID.randomUUID().toString();
        Player player = new Player(playerId, playerName, icon);
        session.addPlayer(player);
        return player;
    }

    public GameSession getSession(String sessionId) {
        GameSession session = sessions.get(sessionId);
        if (session == null) {
            throw new IllegalArgumentException("Session not found: " + sessionId);
        }
        return session;
    }

    public void startGame(String sessionId) {
        GameSession session = getSession(sessionId);
        session.setStatus(GameStatus.PLAYING);
        
        QuizResponse quiz = quizService.generateQuiz(session.getSettings());
        session.setCurrentQuiz(quiz);
    }

    public QuizResponse nextQuestion(String sessionId) {
        GameSession session = getSession(sessionId);
        if (session.getStatus() != GameStatus.PLAYING) {
            throw new IllegalStateException("Game is not in PLAYING state.");
        }

        QuizResponse quiz = quizService.generateQuiz(session.getSettings());
        session.setCurrentQuiz(quiz);
        return quiz;
    }

    public AnswerResult submitAnswer(String sessionId, String playerId, String answer) {
        GameSession session = getSession(sessionId);
        
        if (session.getStatus() != GameStatus.PLAYING) {
            throw new IllegalStateException("Game is not in PLAYING state.");
        }
        
        QuizResponse currentQuiz = session.getCurrentQuiz();
        if (currentQuiz == null) {
            throw new IllegalStateException("No active quiz found.");
        }

        boolean isCorrect = currentQuiz.getCorrectAnswer().equalsIgnoreCase(answer);
        int newScore = 0;

        Player player = session.getPlayers().stream()
                .filter(p -> p.getId().equals(playerId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Player not found: " + playerId));

        if (isCorrect) {
            // スコア加算ロジック (例: 10点加算)
            player.setScore(player.getScore() + 10);
        }
        newScore = player.getScore();

        // ターンを進める
        List<Player> players = session.getPlayers();
        if (!players.isEmpty()) {
            int nextTurnIndex = (session.getCurrentTurnIndex() + 1) % players.size();
            session.setCurrentTurnIndex(nextTurnIndex);
        }

        return new AnswerResult(isCorrect, currentQuiz.getCorrectAnswer(), newScore);
    }
}
