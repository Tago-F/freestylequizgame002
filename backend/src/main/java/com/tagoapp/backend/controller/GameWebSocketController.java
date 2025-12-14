package com.tagoapp.backend.controller;

import com.tagoapp.backend.model.GameSession;
import com.tagoapp.backend.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class GameWebSocketController {

    private final GameService gameService;

    @Autowired
    public GameWebSocketController(GameService gameService) {
        this.gameService = gameService;
    }

    @MessageMapping("/join/{sessionId}")
    public void joinSession(@DestinationVariable String sessionId, GameController.JoinRequest request) {
        gameService.joinSession(sessionId, request.getPlayerName(), request.getIcon());
    }

    @MessageMapping("/start/{sessionId}")
    public void startOrNextQuestion(@DestinationVariable String sessionId) {
        GameSession session = gameService.getSession(sessionId);
        if (session.getCurrentQuiz() == null) {
            gameService.startGame(sessionId);
        } else {
            gameService.nextQuestion(sessionId);
        }
    }

    @MessageMapping("/answer/{sessionId}")
    public void submitAnswer(@DestinationVariable String sessionId, GameController.AnswerRequest request) {
        gameService.submitAnswer(sessionId, request.getPlayerId(), request.getAnswer(), request.isUsedHint());
    }
}
