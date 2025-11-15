package com.tagoapp.backend.service;

import com.tagoapp.backend.dto.GenerateQuizRequest;
import com.tagoapp.backend.dto.QuizResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class QuizServiceImpl implements QuizService {

    private final ChatClient chatClient;

    public QuizServiceImpl(ChatModel chatModel) {
        this.chatClient = ChatClient.create(chatModel);
    }

    @Override
    public QuizResponse generateQuiz(GenerateQuizRequest request) {
        String prompt = """
            あなたはプロのクイズマスターです。
            以下のテーマと難易度に基づいて、4択のクイズを1問生成してください。

            テーマ: {genre}
            難易度: {difficulty}

            生成するクイズは、以下のJSON形式に厳密に従ってください。
            {
              "question": "問題文",
              "options": [
                "選択肢A",
                "選択肢B",
                "選択肢C",
                "選択肢D"
              ],
              "correctAnswer": "正解の選択肢の文字列",
              "explanation": "正解に関する簡潔な解説"
            }

            - `correctAnswer`の値は、`options`配列内のいずれかの文字列と完全に一致させてください。
            - `options`は必ず4つの要素を持つ配列にしてください。
            - JSON以外の余計なテキスト（例: 「はい、承知しました。」など）は絶対に含めないでください。
            """;

        return chatClient.prompt()
                .user(p -> p.text(prompt)
                        .params(Map.of("genre", request.getGenre(), "difficulty", request.getDifficulty())))
                .call()
                .entity(QuizResponse.class);
    }
}
