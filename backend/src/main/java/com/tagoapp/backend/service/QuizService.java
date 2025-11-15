package com.tagoapp.backend.service;

import com.tagoapp.backend.dto.GenerateQuizRequest;
import com.tagoapp.backend.dto.QuizResponse;

public interface QuizService {
    QuizResponse generateQuiz(GenerateQuizRequest request);
}
