package com.tagoapp.backend.service;

import com.tagoapp.backend.dto.AnswerResult;
import com.tagoapp.backend.dto.GenerateQuizRequest;
import com.tagoapp.backend.dto.QuizResponse;
import com.tagoapp.backend.model.GameSession;
import com.tagoapp.backend.model.GameStatus;
import com.tagoapp.backend.model.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Service
public class GameService {

    private final Map<String, GameSession> sessions = new ConcurrentHashMap<>();
    private final QuizService quizService;
    private final SimpMessagingTemplate template;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private final Map<String, ScheduledFuture<?>> sessionTimers = new ConcurrentHashMap<>();

    @Autowired
    public GameService(QuizService quizService, SimpMessagingTemplate template) {
        this.quizService = quizService;
        this.template = template;
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
        
        if (session.getPlayers().size() == 1) {
            session.setHostPlayerId(player.getId());
        }

        broadcastState(sessionId);
        
        return player;
    }

    public List<GameSession> getAvailableSessions() {
        return sessions.values().stream()
                .filter(session -> !session.isGameStarted() && !session.isPrivate())
                .toList();
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
        session.setGameStarted(true);
        
        QuizResponse quiz = quizService.generateQuiz(session.getSettings());
        session.setCurrentQuiz(quiz);

        startCountdown(sessionId);
        broadcastState(sessionId);
    }

    public QuizResponse nextQuestion(String sessionId) {
        GameSession session = getSession(sessionId);
        if (session.getStatus() != GameStatus.PLAYING) {
            throw new IllegalStateException("Game is not in PLAYING state.");
        }

        int currentCount = session.getCurrentQuestionCount();
        Integer maxQuestions = session.getSettings().getNumberOfQuestions();

        if (maxQuestions != null && currentCount >= maxQuestions) {
            session.setStatus(GameStatus.FINISHED);
            stopCountdown(sessionId);
            broadcastState(sessionId);
            return null;
        }
        
        session.setCurrentQuestionCount(currentCount + 1);

        QuizResponse quiz = quizService.generateQuiz(session.getSettings());
        session.setCurrentQuiz(quiz);

        startCountdown(sessionId);
        broadcastState(sessionId);

        return quiz;
    }

    public AnswerResult submitAnswer(String sessionId, String playerId, String answer, boolean usedHint) {
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
            // スコア加算ロジック
            int points = usedHint ? 5 : 10;
            player.setScore(player.getScore() + points);
        }
        newScore = player.getScore();

        // ターンを進める
        List<Player> players = session.getPlayers();
        if (!players.isEmpty()) {
            int nextTurnIndex = (session.getCurrentTurnIndex() + 1) % players.size();
            session.setCurrentTurnIndex(nextTurnIndex);
        }
        
        AnswerResult result = new AnswerResult(isCorrect, currentQuiz.getCorrectAnswer(), newScore);
        
        // Stop timer when answer submitted (optional, but good for turn-based) or let it run?
        // Usually for turn-based, we stop or reset.
        // But instruction says: "タイマーの停止: セッション終了時や次の問題に行く際"
        // It does not explicitly say to stop on answer, but usually we proceed to next question manually or automatically.
        // For now, I will NOT stop the timer on answer submission, assuming "nextQuestion" will stop it.
        
        broadcastState(sessionId);
        template.convertAndSend("/topic/room/" + sessionId + "/result", result);
        
        return result;
    }

    private void broadcastState(String sessionId) {
        GameSession session = getSession(sessionId);
        template.convertAndSend("/topic/room/" + sessionId, session);
    }

    private void startCountdown(String sessionId) {
        stopCountdown(sessionId);

        GameSession session = getSession(sessionId);
        Integer timeLimit = session.getSettings().getTimeLimit();

        if (timeLimit == null || timeLimit <= 0) {
            return;
        }

        session.setRemainingTime(timeLimit);
        // broadcastState is called after this in caller methods (startGame, nextQuestion)
        // But for update consistency, we might want to broadcast here or rely on callers.
        // The callers call broadcastState AFTER calling startCountdown, so the initial time is sent.
        
        ScheduledFuture<?> timer = scheduler.scheduleAtFixedRate(() -> {
            try {
                // Check if session still exists
                if (!sessions.containsKey(sessionId)) {
                    stopCountdown(sessionId);
                    return;
                }
                
                // Re-fetch session in case object reference changed (though it shouldn't in this map structure)
                // But concurrency-wise, simple get is fine.
                // However, we need to modify session state.
                synchronized (session) {
                    Integer remaining = session.getRemainingTime();
                    if (remaining == null) return;
                    
                    remaining--;
                    session.setRemainingTime(remaining);
                    
                    if (remaining <= 0) {
                        stopCountdown(sessionId);
                        System.out.println("Time Up! Session: " + sessionId);
                        // Optional: trigger next turn or state change?
                        // For now just broadcast 0.
                    }
                }
                broadcastState(sessionId);
                
            } catch (Exception e) {
                System.err.println("Error in timer for session " + sessionId + ": " + e.getMessage());
                stopCountdown(sessionId);
            }
        }, 1, 1, TimeUnit.SECONDS);

        sessionTimers.put(sessionId, timer);
    }
    
    private void stopCountdown(String sessionId) {
        ScheduledFuture<?> timer = sessionTimers.remove(sessionId);
        if (timer != null) {
            timer.cancel(true);
        }
    }
}
