package com.tagoapp.backend.service;

import com.tagoapp.backend.dto.GenerateQuizRequest;
import com.tagoapp.backend.dto.HintRequest;
import com.tagoapp.backend.dto.HintResponse;
import com.tagoapp.backend.dto.QuizResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class QuizServiceImpl implements QuizService {

    private final ChatClient chatClient;
    private final PromptTemplate quizGenerationPromptTemplate;
    private final PromptTemplate hintGenerationPromptTemplate;

    public QuizServiceImpl(ChatModel chatModel,
                           @Value("classpath:prompts/quiz-generation.st") Resource quizGenerationResource,
                           @Value("classpath:prompts/hint-generation.st") Resource hintGenerationResource) {
        this.chatClient = ChatClient.create(chatModel);
        this.quizGenerationPromptTemplate = new PromptTemplate(quizGenerationResource);
        this.hintGenerationPromptTemplate = new PromptTemplate(hintGenerationResource);
    }

    @Override
    public QuizResponse generateQuiz(GenerateQuizRequest request) {
        var prompt = quizGenerationPromptTemplate.create(
                Map.of("genre", request.getGenre(), "difficulty", request.getDifficulty())
        );

        return chatClient.prompt(prompt)
                .call()
                .entity(QuizResponse.class);
    }

    @Override
    public HintResponse generateHint(HintRequest request) {
        var prompt = hintGenerationPromptTemplate.create(
                Map.of("question", request.getQuestion(), "options", request.getOptions())
        );

        return chatClient.prompt(prompt)
                .call()
                .entity(HintResponse.class);
    }
}
