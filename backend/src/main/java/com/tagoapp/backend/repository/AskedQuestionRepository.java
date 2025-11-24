package com.tagoapp.backend.repository;

import com.tagoapp.backend.entity.AskedQuestion;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AskedQuestionRepository extends JpaRepository<AskedQuestion, Long> {

    /**
     * 指定されたジャンルの問題文を、ページング情報を元に取得します。
     * @param genre ジャンル
     ** @param pageable ページング情報（取得件数、ソート順など）
     * @return 問題文のリスト
     */
    @Query("SELECT aq.question FROM AskedQuestion aq WHERE aq.genre = :genre")
    List<String> findQuestionsByGenre(String genre, Pageable pageable);
}
