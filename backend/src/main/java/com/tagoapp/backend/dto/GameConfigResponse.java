package com.tagoapp.backend.dto;

import java.util.List;

public class GameConfigResponse {
    private List<GenreCategory> genreCategories;
    private List<String> difficulties;
    private List<GameModeItem> gameModes;

    public GameConfigResponse() {}

    public GameConfigResponse(List<GenreCategory> genreCategories, List<String> difficulties, List<GameModeItem> gameModes) {
        this.genreCategories = genreCategories;
        this.difficulties = difficulties;
        this.gameModes = gameModes;
    }

    public List<GenreCategory> getGenreCategories() {
        return genreCategories;
    }

    public void setGenreCategories(List<GenreCategory> genreCategories) {
        this.genreCategories = genreCategories;
    }

    public List<String> getDifficulties() {
        return difficulties;
    }

    public void setDifficulties(List<String> difficulties) {
        this.difficulties = difficulties;
    }

    public List<GameModeItem> getGameModes() {
        return gameModes;
    }

    public void setGameModes(List<GameModeItem> gameModes) {
        this.gameModes = gameModes;
    }
}
