package com.tagoapp.backend.dto;

import java.util.List;

public class GenreCategory {
    private String name;
    private List<String> genres;

    public GenreCategory() {}

    public GenreCategory(String name, List<String> genres) {
        this.name = name;
        this.genres = genres;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getGenres() {
        return genres;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
    }
}
