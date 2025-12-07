import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import { WebSocketService } from './websocket.service';
import { PlayerStateService } from './player-state.service';
import { GenerateQuizRequest, QuizResponse, HintResponse, GenreCategory, GameModeItem, Player, GameSession } from './quiz.model';

@Injectable({
  providedIn: 'root'
})
export class QuizStateService {
  private apiService = inject(ApiService);
  private webSocketService = inject(WebSocketService);
  private playerStateService = inject(PlayerStateService);
  private platformId = inject(PLATFORM_ID);

  // Signals for config data loaded from API
  public readonly genreCategories = signal<GenreCategory[]>([]);
  public readonly difficulties = signal<string[]>([]);
  public readonly gameModes = signal<GameModeItem[]>([]); // Keep this for now, it's from GameConfigResponse

  private selectedGenre = signal<string | null>(null);
  private selectedDifficulty = signal<string>('ふつう');
  private selectedTimeLimit = signal<number | null>(null); // New: Time limit signal
  private numberOfQuestions = signal<number>(15);
  private currentQuestionIndex = signal<number>(0);
  private currentQuiz = signal<QuizResponse | null>(null);
  private currentHint = signal<HintResponse | null>(null);
  private currentSessionId = signal<string | null>(null); // New: Session ID signal
  private isLoading = signal<boolean>(false); // Added missing isLoading
  private error = signal<string | null>(null); // Added missing error
  private _remainingTime = signal<number | null>(null);

  // Public signals for components to read
  public readonly genre = this.selectedGenre.asReadonly();
  public readonly difficulty = this.selectedDifficulty.asReadonly();
  public readonly timeLimit = this.selectedTimeLimit.asReadonly(); // New: Public time limit signal
  public readonly totalQuestions = this.numberOfQuestions.asReadonly();
  public readonly questionIndex = this.currentQuestionIndex.asReadonly();
  public readonly quiz = this.currentQuiz.asReadonly();
  public readonly hint = this.currentHint.asReadonly();
  public readonly sessionId = this.currentSessionId.asReadonly();
  public readonly loading = this.isLoading.asReadonly();
  public readonly errorMessage = this.error.asReadonly();
  public readonly remainingTime = this._remainingTime.asReadonly();

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

  // New: Set time limit
  setTimeLimit(seconds: number | null): void {
    this.selectedTimeLimit.set(seconds);
  }

  setNumberOfQuestions(count: number): void {
    this.numberOfQuestions.set(count);
  }

  incrementQuestionIndex(): void {
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
    const timeLimit = this.selectedTimeLimit(); // Get time limit
    if (genre && difficulty) {
      return {
        genre,
        difficulty,
        timeLimit // Include time limit
      };
    }
    return null;
  }

  connectToSession(sessionId: string): void {
    this.webSocketService.connect();
    this.webSocketService.watch('/topic/room/' + sessionId).subscribe(message => {
        const gameSession: GameSession = JSON.parse(message.body);
        if (gameSession.currentQuiz) {
            this.currentQuiz.set(gameSession.currentQuiz);
        }
        if (gameSession.remainingTime !== undefined) {
             this._remainingTime.set(gameSession.remainingTime);
        }
        if (gameSession.players) {
            this.playerStateService.setPlayers(gameSession.players);
        }
    });
  }
  
  // New: Initialize online game
  async initializeOnlineGame(players: Player[]): Promise<Player[] | null> {
    const settings = this.getQuizConfigRequest();
    if (!settings) {
      this.error.set('Quiz configuration is incomplete.');
      return null;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      // Step 1: Create Game Session
      const sessionResponse = await firstValueFrom(this.apiService.createGameSession(settings));
      this.currentSessionId.set(sessionResponse.sessionId);
      const sessionId = sessionResponse.sessionId;

      // Connect to WebSocket
      this.connectToSession(sessionId);

      // Step 2: Join Players
      const joinPromises = players.map(player =>
        firstValueFrom(this.apiService.joinGameSession(sessionId, player.name, player.icon))
      );
      
      const joinedPlayers = await Promise.all(joinPromises);

      // Step 3: Start Game
      await firstValueFrom(this.apiService.startGame(sessionId));

      // Fetch initial state is removed as WS should handle updates, but we return joinedPlayers as before.
      return joinedPlayers;

    } catch (err: any) {
      this.error.set(err.message || 'Failed to initialize online game');
      console.error('Online game initialization error:', err);
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async generateQuiz(): Promise<void> {
      const settings = this.getQuizConfigRequest();
      if (!settings) return;

      this.isLoading.set(true);
      this.error.set(null);

      try {
        const quiz = await firstValueFrom(this.apiService.generateQuiz(settings));
        this.currentQuiz.set(quiz);
      } catch (err: any) {
        this.error.set(err.message || 'Failed to generate quiz');
        console.error('Quiz generation error:', err);
      } finally {
        this.isLoading.set(false);
      }
    }
    
  async generateHint(): Promise<void> {
      const quiz = this.currentQuiz();
      if (!quiz) return;

      this.isLoading.set(true);
      try {
        const response = await firstValueFrom(this.apiService.generateHint({
          question: quiz.question,
          options: quiz.options
        }));
        this.currentHint.set(response);
      } catch (err: any) {
        console.error('Hint generation error:', err);
      } finally {
        this.isLoading.set(false);
      }
    }

  resetQuizState(): void {
    this.selectedGenre.set(null);
    this.selectedDifficulty.set('ふつう');
    this.selectedTimeLimit.set(null); // Reset time limit
    this.numberOfQuestions.set(15);
    this.currentQuestionIndex.set(0);
    this.currentQuiz.set(null);
    this.currentHint.set(null);
    this.currentSessionId.set(null);
    this.error.set(null);
    this._remainingTime.set(null);
  }
}