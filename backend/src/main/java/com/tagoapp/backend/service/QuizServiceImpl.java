package com.tagoapp.backend.service;

import com.tagoapp.backend.dto.GenerateQuizRequest;
import com.tagoapp.backend.dto.HintRequest;
import com.tagoapp.backend.dto.HintResponse;
import com.tagoapp.backend.dto.QuizResponse;
import com.tagoapp.backend.entity.Question;
import com.tagoapp.backend.repository.QuestionRepository;
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
    private final QuestionRepository questionRepository;

    public QuizServiceImpl(ChatModel chatModel,
                           QuestionRepository questionRepository,
                           @Value("classpath:prompts/quiz-generation.st") Resource quizGenerationResource,
                           @Value("classpath:prompts/hint-generation.st") Resource hintGenerationResource) throws IOException {
        this.chatClient = ChatClient.create(chatModel);
        this.questionRepository = questionRepository;
        this.quizGenerationPromptString = quizGenerationResource.getContentAsString(StandardCharsets.UTF_8);
        this.hintGenerationPromptString = hintGenerationResource.getContentAsString(StandardCharsets.UTF_8);
    }

    @Override
    @Transactional
    public QuizResponse generateQuiz(GenerateQuizRequest request) {
        // 1. DBから指定ジャンルの過去問リストを最新30件取得
        Pageable pageable = PageRequest.of(0, 30, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<String> previousQuestions = questionRepository.findContentByGenre(request.getGenre(), pageable);

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
                Question question = new Question();
                question.setContent(quizResponse.getQuestion());
                question.setGenre(request.getGenre());
                question.setDifficulty(request.getDifficulty());
                question.setCorrectAnswer(quizResponse.getCorrectAnswer());
                question.setExplanation(quizResponse.getExplanation());

                List<String> options = quizResponse.getOptions();
                if (options != null) {
                    if (options.size() > 0) question.setOption1(options.get(0));
                    if (options.size() > 1) question.setOption2(options.get(1));
                    if (options.size() > 2) question.setOption3(options.get(2));
                    if (options.size() > 3) question.setOption4(options.get(3));
                }

                questionRepository.save(question);
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
