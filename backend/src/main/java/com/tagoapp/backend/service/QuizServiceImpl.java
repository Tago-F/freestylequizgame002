package com.tagoapp.backend.service;

import com.tagoapp.backend.dto.GenerateQuizRequest;
import com.tagoapp.backend.dto.HintRequest;
import com.tagoapp.backend.dto.HintResponse;
import com.tagoapp.backend.dto.QuizResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.stringtemplate.v4.ST;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
public class QuizServiceImpl implements QuizService {

    private final ChatClient chatClient;
    private final String quizGenerationPromptString;
    private final String hintGenerationPromptString;

    public QuizServiceImpl(ChatModel chatModel,
                           @Value("classpath:prompts/quiz-generation.st") Resource quizGenerationResource,
                           @Value("classpath:prompts/hint-generation.st") Resource hintGenerationResource) throws IOException {
        this.chatClient = ChatClient.create(chatModel);
        this.quizGenerationPromptString = quizGenerationResource.getContentAsString(StandardCharsets.UTF_8);
        this.hintGenerationPromptString = hintGenerationResource.getContentAsString(StandardCharsets.UTF_8);
    }

    @Override
    public QuizResponse generateQuiz(GenerateQuizRequest request) {
        ST st = new ST(quizGenerationPromptString);

        st.add("genre", request.getGenre());
        st.add("difficulty", request.getDifficulty());
        if (request.getPreviousQuestions() != null && !request.getPreviousQuestions().isEmpty()) {
            st.add("previousQuestions", request.getPreviousQuestions());
        }

        String renderedPrompt = st.render();
        // デバッグ
        System.out.println(renderedPrompt);

        return chatClient.prompt()
                .user(renderedPrompt)
                .call()
                .entity(QuizResponse.class);
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
