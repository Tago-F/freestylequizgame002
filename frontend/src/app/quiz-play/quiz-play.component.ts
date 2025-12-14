import { Component, OnInit, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlayerStateService } from '../shared/player-state.service';
import { QuizStateService } from '../shared/quiz-state.service';
import { ApiService } from '../shared/api.service';
import { WebSocketService } from '../shared/websocket.service';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { QuizResultModal } from './quiz-result-modal/quiz-result-modal';

type ViewState = 'loading' | 'quiz' | 'answer' | 'error';

@Component({
  selector: 'app-quiz-play',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './quiz-play.component.html',
  styleUrls: ['./quiz-play.component.css']
})
export class QuizPlayComponent implements OnInit {
  viewState = signal<ViewState>('loading');
  selectedAnswer = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  // Additional signal to show correct answer from server
  correctAnswer = signal<string | null>(null);
  isCorrect = signal<boolean>(false);

  infinity = Infinity;

  private webSocketService = inject(WebSocketService);

  constructor(
    public playerState: PlayerStateService,
    public quizState: QuizStateService,
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog
  ) {
    effect(() => {
      const quiz = this.quizState.quiz();
      if (quiz) {
        this.viewState.set('quiz');
      }
    });
  }

  ngOnInit(): void {
    const sessionId = this.quizState.sessionId();
    if (!sessionId) {
      // If no session, try to redirect or handle error. 
      // For now, redirect to setup.
      this.router.navigate(['/quiz/game-setup']);
      return;
    }

    // Initial check: if quiz is already loaded in service
    if (this.quizState.quiz()) {
      this.viewState.set('quiz');
    } else {
      this.viewState.set('loading');
    }

    // Subscribe to answer results from QuizStateService
    this.quizState.answerResult$.subscribe(result => {
      this.isCorrect.set(result.correct);
      this.correctAnswer.set(result.correctAnswer);
      
      // Update score using the new score from the result
      const currentPlayer = this.playerState.currentPlayer();
      if (currentPlayer) { // Check if current player exists (for safety)
         this.playerState.updatePlayerScore(currentPlayer.id, result.newScore);
      }

      this.viewState.set('answer'); // Switch to answer display mode
    });
  }

  fetchNewQuiz(): void {
    const sessionId = this.quizState.sessionId();
    if (!sessionId) return;

    if (this.quizState.questionIndex() >= this.quizState.totalQuestions()) {
      this.openQuizResultModal();
      return;
    }

    this.viewState.set('loading');
    this.selectedAnswer.set(null);
    this.correctAnswer.set(null);
    this.quizState.setCurrentHint(null);

    this.webSocketService.publish('/app/start/' + sessionId, {});
  }

  selectAnswer(option: string): void {
    if (this.viewState() !== 'quiz') return;
    
    const sessionId = this.quizState.sessionId();
    const currentPlayer = this.playerState.currentPlayer();
    
    if (!sessionId || !currentPlayer) return;

    this.selectedAnswer.set(option);
    this.viewState.set('loading'); // Wait for server update

    this.webSocketService.publish('/app/answer/' + sessionId, {
      playerId: currentPlayer.id,
      answer: option
    });
  }

  fetchHint(): void {
    const currentQuiz = this.quizState.quiz();
    if (!currentQuiz) return;

    this.viewState.set('loading');
    this.apiService.generateHint({
      question: currentQuiz.question,
      options: currentQuiz.options
    }).subscribe({
      next: (hint) => {
        this.quizState.setCurrentHint(hint);
        this.viewState.set('quiz');
      },
      error: (err) => {
        console.error('Hint generation failed:', err);
        this.handleError('ヒントの生成に失敗しました。');
      }
    });
  }

  adjustScore(playerId: string, amount: number): void {
    this.playerState.adjustScore(playerId, amount);
  }

  addUser(): void {
    // In online mode, adding users mid-game might be restricted or different.
    // For now, keep navigating but it might break the session flow.
    this.router.navigate(['/quiz/player-setup']);
  }

  resetGame(): void {
    this.playerState.reset();
    this.quizState.resetQuizState();
    this.router.navigate(['/quiz/player-setup']);
  }

  backToSettings(): void {
    this.quizState.resetQuizState();
    this.router.navigate(['/quiz/game-setup']);
  }

  openQuizResultModal(): void {
    this.dialog.open(QuizResultModal, {
      width: '350px',
      disableClose: true
    });
  }

  private handleError(message: string): void {
    this.errorMessage.set(message);
    this.viewState.set('error');
  }
}