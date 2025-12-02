package com.tagoapp.backend.repository;

import com.tagoapp.backend.entity.Question;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query("SELECT q.content FROM Question q WHERE q.genre = :genre")
    List<String> findContentByGenre(String genre, Pageable pageable);
}
