package com.tagoapp.backend.dto;

public class AnswerResult {
    private boolean correct;
    private String correctAnswer;
    private int newScore;

    public AnswerResult(boolean correct, String correctAnswer, int newScore) {
        this.correct = correct;
        this.correctAnswer = correctAnswer;
        this.newScore = newScore;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public int getNewScore() {
        return newScore;
    }

    public void setNewScore(int newScore) {
        this.newScore = newScore;
    }
}
