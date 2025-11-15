package com.tagoapp.backend.service;

import com.tagoapp.backend.dto.GenerateQuizRequest;
import com.tagoapp.backend.dto.QuizResponse;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class QuizServiceImpl implements QuizService {

    @Override
    public QuizResponse generateQuiz(GenerateQuizRequest request) {
        // This is a mock implementation for now.
        // It will be replaced with actual AI logic in task BE-03.
        return new QuizResponse(
                "これは " + request.getGenre() + " に関する「" + request.getDifficulty() + "」レベルのモック問題です。Javaのキーワードで、継承できないクラスを宣言するのはどれ？",
                Arrays.asList("A: private", "B: static", "C: final", "D: abstract"),
                "C: final",
                "finalキーワードをクラスに付与すると、そのクラスは他のクラスから継承できなくなります。これはセキュリティや設計上の理由で利用されます。"
        );
    }
}
