package com.tagoapp.backend.model;

import com.tagoapp.backend.dto.GenerateQuizRequest;
import com.tagoapp.backend.dto.QuizResponse;

import java.util.ArrayList;
import java.util.List;

public class GameSession {
    private String sessionId;
    private List<Player> players;
    private GameStatus status;
    private int currentTurnIndex;
    private GenerateQuizRequest settings;
    private QuizResponse currentQuiz;

    public GameSession(String sessionId, GenerateQuizRequest settings) {
        this.sessionId = sessionId;
        this.players = new ArrayList<>();
        this.status = GameStatus.WAITING;
        this.currentTurnIndex = 0;
        this.settings = settings;
    }

    public void addPlayer(Player player) {
        this.players.add(player);
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }

    public GameStatus getStatus() {
        return status;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
    }

    public int getCurrentTurnIndex() {
        return currentTurnIndex;
    }

    public void setCurrentTurnIndex(int currentTurnIndex) {
        this.currentTurnIndex = currentTurnIndex;
    }

    public GenerateQuizRequest getSettings() {
        return settings;
    }

    public void setSettings(GenerateQuizRequest settings) {
        this.settings = settings;
    }

    public QuizResponse getCurrentQuiz() {
        return currentQuiz;
    }

    public void setCurrentQuiz(QuizResponse currentQuiz) {
        this.currentQuiz = currentQuiz;
    }
}
