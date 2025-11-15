package com.tagoapp.backend.dto;

public class HintResponse {
    private String hint;

    // Constructors
    public HintResponse() {
    }

    public HintResponse(String hint) {
        this.hint = hint;
    }

    // Getters and Setters
    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }
}
