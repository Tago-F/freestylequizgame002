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
    private Integer remainingTime;
    private String hostPlayerId;
    private String roomName;
    private String password;
    private boolean isGameStarted;
    private int currentQuestionCount;
    private boolean isPrivate;

    public GameSession(String sessionId, GenerateQuizRequest settings) {
        this.sessionId = sessionId;
        this.players = new ArrayList<>();
        this.status = GameStatus.WAITING;
        this.currentTurnIndex = 0;
        this.settings = settings;
        this.roomName = settings.getRoomName();
        this.password = settings.getPassword();
        this.isGameStarted = false;
        this.currentQuestionCount = 1;
        this.isPrivate = settings.isPrivate();
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

    public Integer getRemainingTime() {
        return remainingTime;
    }

    public void setRemainingTime(Integer remainingTime) {
        this.remainingTime = remainingTime;
    }

    public String getHostPlayerId() {
        return hostPlayerId;
    }

    public void setHostPlayerId(String hostPlayerId) {
        this.hostPlayerId = hostPlayerId;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isGameStarted() {
        return isGameStarted;
    }

    public void setGameStarted(boolean gameStarted) {
        isGameStarted = gameStarted;
    }

    public int getCurrentQuestionCount() {
        return currentQuestionCount;
    }

    public void setCurrentQuestionCount(int currentQuestionCount) {
        this.currentQuestionCount = currentQuestionCount;
    }

    public boolean isPrivate() {
        return isPrivate;
    }

    public void setPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }
}
