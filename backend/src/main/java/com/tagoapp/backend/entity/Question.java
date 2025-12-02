package com.tagoapp.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String genre;

    private String difficulty;

    private String option1;

    private String option2;

    private String option3;

    private String option4;

    private String correctAnswer;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
