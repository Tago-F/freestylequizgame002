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
        Map<String, Object> model = new java.util.HashMap<>();
        model.put("genre", request.getGenre());
        model.put("difficulty", request.getDifficulty());
        if (request.getPreviousQuestions() != null && !request.getPreviousQuestions().isEmpty()) {
            model.put("previousQuestions", request.getPreviousQuestions());
        }

        var prompt = quizGenerationPromptTemplate.create(model);

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
