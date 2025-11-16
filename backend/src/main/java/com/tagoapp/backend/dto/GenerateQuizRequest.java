package com.tagoapp.backend.dto;

import java.util.List;

public class GenerateQuizRequest {
    private String genre;
    private String difficulty;
    private List<String> previousQuestions;

    // Getters and Setters
    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public List<String> getPreviousQuestions() {
        return previousQuestions;
    }

    public void setPreviousQuestions(List<String> previousQuestions) {
        this.previousQuestions = previousQuestions;
    }
}
