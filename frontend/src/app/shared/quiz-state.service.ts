import { Injectable, signal, computed } from '@angular/core';
import { GenerateQuizRequest, QuizResponse, HintResponse } from './quiz.model';

export type GameMode = 'all' | 'turn';

export interface GenreCategory {
  name: string;
  genres: string[];
}

@Injectable({
  providedIn: 'root'
})
export class QuizStateService {
  public readonly genreCategories: GenreCategory[] = [
    {
      name: '一般ジャンル',
      genres: ['歴史', '化学', '地理', '映画', 'アニメ']
    },
    {
      name: 'ITスキル',
      genres: ['プログラミング', 'Java', 'C#', 'Python', 'SQL']
    },
    {
      name: 'ランダム',
      genres: ['ランダム']
    }
  ];

  public readonly difficulties = ['かんたん', 'ふつう', 'むずかしい'];

  private selectedGenre = signal<string | null>(null);
  private selectedDifficulty = signal<string | null>(null);
  private selectedGameMode = signal<GameMode>('all');
  private numberOfQuestions = signal<number>(Infinity); // New: Stores the total number of questions
  private currentQuestionIndex = signal<number>(0);     // New: Tracks the current question number
  private currentQuiz = signal<QuizResponse | null>(null);
  private currentHint = signal<HintResponse | null>(null);

  // Public signals for components to read
  public readonly genre = this.selectedGenre.asReadonly();
  public readonly difficulty = this.selectedDifficulty.asReadonly();
  public readonly gameMode = this.selectedGameMode.asReadonly();
  public readonly totalQuestions = this.numberOfQuestions.asReadonly(); // New: Public accessor
  public readonly questionIndex = this.currentQuestionIndex.asReadonly(); // New: Public accessor
  public readonly quiz = this.currentQuiz.asReadonly();
  public readonly hint = this.currentHint.asReadonly();

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

  setGameMode(mode: GameMode): void {
    this.selectedGameMode.set(mode);
  }

  setNumberOfQuestions(count: number): void { // New: Setter for total questions
    this.numberOfQuestions.set(count);
  }

  incrementQuestionIndex(): void { // New: Method to increment question index
    this.currentQuestionIndex.update(value => value + 1);
  }

  setCurrentQuiz(quiz: QuizResponse | null): void {
    this.currentQuiz.set(quiz);
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
        difficulty
      };
    }
    return null;
  }

  resetQuizState(): void {
    this.selectedGenre.set(null);
    this.selectedDifficulty.set(null);
    this.selectedGameMode.set('all');
    this.numberOfQuestions.set(Infinity);   // New: Reset total questions
    this.currentQuestionIndex.set(0);       // New: Reset current question index
    this.currentQuiz.set(null);
    this.currentHint.set(null);
  }
}

