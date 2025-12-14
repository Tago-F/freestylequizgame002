package com.tagoapp.backend.controller;

import com.tagoapp.backend.dto.AnswerResult;
import com.tagoapp.backend.dto.GenerateQuizRequest;
import com.tagoapp.backend.dto.QuizResponse;
import com.tagoapp.backend.model.GameSession;
import com.tagoapp.backend.model.Player;
import com.tagoapp.backend.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/game")
public class GameController {

    private final GameService gameService;

    @Autowired
    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createSession(@RequestBody GenerateQuizRequest request) {
        String sessionId = gameService.createSession(request);
        return ResponseEntity.ok(Collections.singletonMap("sessionId", sessionId));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<GameSession>> getAvailableSessions() {
        List<GameSession> sessions = gameService.getAvailableSessions();
        return ResponseEntity.ok(sessions);
    }

    @PostMapping("/{sessionId}/join")
    public ResponseEntity<Player> joinSession(
            @PathVariable String sessionId,
            @RequestBody JoinRequest request) {
        Player player = gameService.joinSession(sessionId, request.getPlayerName(), request.getIcon());
        return ResponseEntity.ok(player);
    }

    @PostMapping("/{sessionId}/start")
    public ResponseEntity<Void> startGame(@PathVariable String sessionId) {
        gameService.startGame(sessionId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<GameSession> getSession(@PathVariable String sessionId) {
        GameSession session = gameService.getSession(sessionId);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/{sessionId}/next")
    public ResponseEntity<QuizResponse> nextQuestion(@PathVariable String sessionId) {
        QuizResponse quiz = gameService.nextQuestion(sessionId);
        return ResponseEntity.ok(quiz);
    }

    @PostMapping("/{sessionId}/answer")
    public ResponseEntity<AnswerResult> submitAnswer(
            @PathVariable String sessionId,
            @RequestBody AnswerRequest request) {
        AnswerResult result = gameService.submitAnswer(sessionId, request.getPlayerId(), request.getAnswer(), request.isUsedHint());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{sessionId}/leave")
    public ResponseEntity<Void> leaveSession(
            @PathVariable String sessionId,
            @RequestBody String playerId) {
        gameService.leaveSession(sessionId, playerId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{sessionId}/end")
    public ResponseEntity<Void> endSession(@PathVariable String sessionId) {
        gameService.endSession(sessionId);
        return ResponseEntity.ok().build();
    }

    // Request DTOs
    public static class JoinRequest {
        private String playerName;
        private String icon;

        public String getPlayerName() {
            return playerName;
        }

        public void setPlayerName(String playerName) {
            this.playerName = playerName;
        }

        public String getIcon() {
            return icon;
        }

        public void setIcon(String icon) {
            this.icon = icon;
        }
    }

    public static class AnswerRequest {
        private String playerId;
        private String answer;
        private boolean usedHint;

        public String getPlayerId() {
            return playerId;
        }

        public void setPlayerId(String playerId) {
            this.playerId = playerId;
        }

        public String getAnswer() {
            return answer;
        }

        public void setAnswer(String answer) {
            this.answer = answer;
        }

        public boolean isUsedHint() {
            return usedHint;
        }

        public void setUsedHint(boolean usedHint) {
            this.usedHint = usedHint;
        }
    }
}
