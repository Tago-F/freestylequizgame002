package com.tagoapp.backend.controller;

import com.tagoapp.backend.dto.GenerateQuizRequest;
import com.tagoapp.backend.dto.QuizResponse;
import com.tagoapp.backend.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/quiz")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping("/generate")
    public ResponseEntity<QuizResponse> generateQuiz(@RequestBody GenerateQuizRequest request) {
        QuizResponse response = quizService.generateQuiz(request);
        return ResponseEntity.ok(response);
    }
}
