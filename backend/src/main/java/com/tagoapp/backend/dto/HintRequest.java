package com.tagoapp.backend.dto;

import java.util.List;

public class HintRequest {
    private String question;
    private List<String> options;

    // Getters and Setters
    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }
}
