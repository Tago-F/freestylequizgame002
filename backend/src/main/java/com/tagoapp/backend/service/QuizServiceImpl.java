package com.tagoapp.backend.service;

import com.tagoapp.backend.dto.GenerateQuizRequest;
import com.tagoapp.backend.dto.HintRequest;
import com.tagoapp.backend.dto.HintResponse;
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
            \\{
              "question": "問題文",
              "options": [
                "選択肢A",
                "選択肢B",
                "選択肢C",
                "選択肢D"
              ],
              "correctAnswer": "正解の選択肢の文字列",
              "explanation": "正解に関する簡潔な解説"
            \\}

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

    @Override
    public HintResponse generateHint(HintRequest request) {
        String prompt = """
            あなたはプロのクイズマスターのアシスタントです。
            以下のクイズの問題と選択肢を参考にして、正解を直接示唆しないような、絶妙なヒントを一つだけ生成してください。

            # クイズ情報
            ## 問題
            {question}

            ## 選択肢
            {options}

            # 生成するヒントの形式
            ヒントは以下のJSON形式に厳密に従ってください。
            \\{
              "hint": "ここにヒントを記述"
            \\}

            # 注意事項
            - ヒントは簡潔に、1〜2文で記述してください。
            - 正解の選択肢の文言をそのまま含めないでください。
            - JSON以外の余計なテキストは絶対に含めないでください。
            """;

        return chatClient.prompt()
                .user(p -> p.text(prompt)
                        .params(Map.of("question", request.getQuestion(), "options", request.getOptions())))
                .call()
                .entity(HintResponse.class);
    }
}
