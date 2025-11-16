import { Injectable, signal, computed } from '@angular/core';
import { GenerateQuizRequest, QuizResponse, HintResponse } from './quiz.model';

@Injectable({
  providedIn: 'root'
})
export class QuizStateService {
  public readonly genres = [
    '歴史', '化学', '地理', '映画', 'アニメ',
    'プログラミングの概念', 'Java', 'C#', 'Python', 'SQL',
    'ランダム'
  ];

  public readonly difficulties = ['かんたん', 'ふつう', 'むずかしい'];

  private selectedGenre = signal<string | null>(null);
  private selectedDifficulty = signal<string | null>(null);
  private currentQuiz = signal<QuizResponse | null>(null);
  private currentHint = signal<HintResponse | null>(null);
  private quizHistory = signal<string[]>([]);

  // Public signals for components to read
  public readonly genre = this.selectedGenre.asReadonly();
  public readonly difficulty = this.selectedDifficulty.asReadonly();
  public readonly quiz = this.currentQuiz.asReadonly();
  public readonly hint = this.currentHint.asReadonly();
  public readonly history = this.quizHistory.asReadonly();

  // Computed signal to check if both genre and difficulty are selected
  public readonly isQuizConfigured = computed(() =>
    this.selectedGenre() !== null && this.selectedDifficulty() !== null
  );

  constructor() { }

  setGenre(genre: string): void {
    this.selectedGenre.set(genre);
  }

  setDifficulty(difficulty: string): void {
    this.selectedDifficulty.set(difficulty);
  }

  setCurrentQuiz(quiz: QuizResponse | null): void {
    this.currentQuiz.set(quiz);
    if (quiz && !this.quizHistory().includes(quiz.question)) {
      this.quizHistory.update(history => [...history, quiz.question]);
    }
  }

  setCurrentHint(hint: HintResponse | null): void {
    this.currentHint.set(hint);
  }

  // Method to get the current quiz configuration for API requests
  getQuizConfigRequest(): GenerateQuizRequest | null {
    const genre = this.selectedGenre();
    const difficulty = this.selectedDifficulty();
    if (genre && difficulty) {
      return {
        genre,
        difficulty,
        previousQuestions: this.quizHistory()
      };
    }
    return null;
  }

  resetQuizState(): void {
    this.selectedGenre.set(null);
    this.selectedDifficulty.set(null);
    this.currentQuiz.set(null);
    this.currentHint.set(null);
    this.quizHistory.set([]);
  }
}
