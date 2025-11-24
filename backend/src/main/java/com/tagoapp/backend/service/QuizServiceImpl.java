package com.tagoapp.backend.service;

import com.tagoapp.backend.dto.GenerateQuizRequest;
import com.tagoapp.backend.dto.HintRequest;
import com.tagoapp.backend.dto.HintResponse;
import com.tagoapp.backend.dto.QuizResponse;
import com.tagoapp.backend.entity.AskedQuestion;
import com.tagoapp.backend.repository.AskedQuestionRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.stringtemplate.v4.ST;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class QuizServiceImpl implements QuizService {

    private final ChatClient chatClient;
    private final String quizGenerationPromptString;
    private final String hintGenerationPromptString;
    private final AskedQuestionRepository askedQuestionRepository;

    public QuizServiceImpl(ChatModel chatModel,
                           AskedQuestionRepository askedQuestionRepository,
                           @Value("classpath:prompts/quiz-generation.st") Resource quizGenerationResource,
                           @Value("classpath:prompts/hint-generation.st") Resource hintGenerationResource) throws IOException {
        this.chatClient = ChatClient.create(chatModel);
        this.askedQuestionRepository = askedQuestionRepository;
        this.quizGenerationPromptString = quizGenerationResource.getContentAsString(StandardCharsets.UTF_8);
        this.hintGenerationPromptString = hintGenerationResource.getContentAsString(StandardCharsets.UTF_8);
    }

    @Override
    @Transactional
    public QuizResponse generateQuiz(GenerateQuizRequest request) {
        // 1. DBから指定ジャンルの過去問リストを最新15件取得
        Pageable pageable = PageRequest.of(0, 15, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<String> previousQuestions = askedQuestionRepository.findQuestionsByGenre(request.getGenre(), pageable);

        // 2. プロンプトを組み立て
        ST st = new ST(quizGenerationPromptString);
        st.add("genre", request.getGenre());
        st.add("difficulty", request.getDifficulty());
        if (previousQuestions != null && !previousQuestions.isEmpty()) {
            st.add("previousQuestions", previousQuestions);
        }

        String renderedPrompt = st.render();
        // デバッグ
        System.out.println(renderedPrompt);

        // 3. AIにリクエストしてクイズを生成
        QuizResponse quizResponse = chatClient.prompt()
                .user(renderedPrompt)
                .call()
                .entity(QuizResponse.class);

        // 4. 生成されたクイズをDBに保存
        // (ユニーク制約により、万が一同じ問題が生成されてもエラーとなり保存されない)
        try {
            if (quizResponse != null && quizResponse.getQuestion() != null) {
                askedQuestionRepository.save(new AskedQuestion(quizResponse.getQuestion(), request.getGenre()));
            }
        } catch (Exception e) {
            // DataIntegrityViolationExceptionなどが発生する可能性があるが、
            // ここでは重複して保存できなかっただけなので、処理は続行する。
            // ログを出力するのが望ましい。
            System.err.println("Failed to save question to DB (might be a duplicate): " + e.getMessage());
        }

        return quizResponse;
    }

    @Override
    public HintResponse generateHint(HintRequest request) {
        ST st = new ST(hintGenerationPromptString);

        st.add("question", request.getQuestion());
        st.add("options", request.getOptions());

        String renderedPrompt = st.render();

        return chatClient.prompt()
                .user(renderedPrompt)
                .call()
                .entity(HintResponse.class);
    }
}
