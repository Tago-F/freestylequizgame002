package com.tagoapp.backend.controller;

import com.tagoapp.backend.dto.GameConfigResponse;
import com.tagoapp.backend.dto.GenreCategory;
import com.tagoapp.backend.dto.GameModeItem;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/game")
public class GameConfigController {

    @GetMapping("/config")
    public GameConfigResponse getGameConfig() {
        List<GenreCategory> genreCategories = Arrays.asList(
            new GenreCategory("汎用", Arrays.asList("ランダム", "雑学")),
            new GenreCategory("アニメ", Arrays.asList("アニメ（1990～1999年）", "アニメ（2000～2009年）", "アニメ（2010年～2019年）", "アニメ（2020年～2025年）")),
            new GenreCategory("ガンダム", Arrays.asList(
                "機動戦士ガンダム", "機動戦士ガンダム SEED", "機動戦士ガンダム 00", "機動戦士ガンダム UC",
                "機動戦士ガンダム 鉄血のオルフェンズ", "機動戦士ガンダム 閃光のハサウェイ", "機動戦士ガンダム 水星の魔女",
                "ガンダム（2000年～2010年）", "ガンダム（2011年～2025年） "
            )),
            new GenreCategory("映画", Arrays.asList("日本の映画", "海外の映画", "ディズニー", "映画全般")),
            new GenreCategory("エンタメ", Arrays.asList("日本のドラマ", "海外のドラマ", "日本の芸能人", "日本のテレビ番組")),
            new GenreCategory("音楽", Arrays.asList("JPOP", "KPOP", "歌詞から曲名当て", "UverWorld")),
            new GenreCategory("教養", Arrays.asList("日本の歴史", "海外の歴史", "日本の地理", "海外の地理", "ご当地（東海地方）", "ご当地（関東地方）")),
            new GenreCategory("サイエンス", Arrays.asList("高校化学", "高校物理")),
            new GenreCategory("IT スキル", Arrays.asList("プログラミングの一般知識", "Java", "Python", "C#", "SQL", "インフラ・サーバー"))
        );

        List<String> difficulties = Arrays.asList("かんたん", "ふつう", "むずかしい");

        List<GameModeItem> gameModes = Arrays.asList(
            new GameModeItem("all", "全員回答モード"),
            new GameModeItem("turn", "ターン制モード")
        );

        return new GameConfigResponse(genreCategories, difficulties, gameModes);
    }
}
