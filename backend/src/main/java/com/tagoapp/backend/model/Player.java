package com.tagoapp.backend.model;

public class Player {
    private String id;
    private String name;
    private int score;
    private String icon;

    public Player(String id, String name, String icon) {
        this.id = id;
        this.name = name;
        this.score = 0;
        this.icon = icon;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
