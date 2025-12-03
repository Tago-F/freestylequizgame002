import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import { GenerateQuizRequest, QuizResponse, HintResponse, GenreCategory, GameModeItem } from './quiz.model';

export type GameMode = 'all' | 'turn';

@Injectable({
  providedIn: 'root'
})
export class QuizStateService {
  private apiService = inject(ApiService);
  private platformId = inject(PLATFORM_ID);

  // Signals for config data loaded from API
  public readonly genreCategories = signal<GenreCategory[]>([]);
  public readonly difficulties = signal<string[]>([]);
  public readonly gameModes = signal<GameModeItem[]>([]);

  private selectedGenre = signal<string | null>(null);
  private selectedDifficulty = signal<string>('ふつう');
  private selectedGameMode = signal<GameMode>('turn');
  private numberOfQuestions = signal<number>(15); // New: Stores the total number of questions
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

  constructor() {
    this.loadGameConfig();
  }

  private async loadGameConfig() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const config = await firstValueFrom(this.apiService.getGameConfig());
        this.genreCategories.set(config.genreCategories);
        this.difficulties.set(config.difficulties);
        this.gameModes.set(config.gameModes);
      } catch (error) {
        console.error('Failed to load game config', error);
      }
    }
  }

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
    this.selectedDifficulty.set('ふつう');
    this.selectedGameMode.set('turn');
    this.numberOfQuestions.set(15);   // New: Reset total questions
    this.currentQuestionIndex.set(0);       // New: Reset current question index
    this.currentQuiz.set(null);
    this.currentHint.set(null);
  }
}