package com.tagoapp.backend.repository;

import com.tagoapp.backend.entity.AskedQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AskedQuestionRepository extends JpaRepository<AskedQuestion, Long> {

    /**
     * データベースに保存されているすべての問題文を取得します。
     * @return 問題文のリスト
     */
    @Query("SELECT aq.question FROM AskedQuestion aq")
    List<String> findAllQuestions();
}
