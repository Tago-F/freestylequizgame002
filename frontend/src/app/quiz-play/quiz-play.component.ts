import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlayerStateService } from '../shared/player-state.service';
import { QuizStateService } from '../shared/quiz-state.service';
import { ApiService } from '../shared/api.service';
import { finalize } from 'rxjs';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Import MatDialog and MatDialogModule
import { QuizResultModal } from './quiz-result-modal/quiz-result-modal'; // Import QuizResultModal

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
    MatDialogModule // Add MatDialogModule here
  ],
  templateUrl: './quiz-play.component.html',
  styleUrls: ['./quiz-play.component.css']
})
export class QuizPlayComponent implements OnInit {
  viewState = signal<ViewState>('loading');
  selectedAnswer = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  infinity = Infinity; // Expose Infinity to the template

  constructor(
    public playerState: PlayerStateService,
    public quizState: QuizStateService,
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog // Inject MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.quizState.isQuizConfigured()) {
      this.router.navigate(['/game-setup']);
      return;
    }
    this.fetchNewQuiz();
  }

  fetchNewQuiz(): void {
    // Check if the quiz limit has been reached *before* incrementing and fetching.
    if (this.quizState.questionIndex() >= this.quizState.totalQuestions()) {
      this.openQuizResultModal();
      return;
    }

    this.quizState.incrementQuestionIndex(); // Increment index for the upcoming question

    // In turn-based mode, advance to the next player *before* fetching a new quiz,
    // but only if it's not the very first quiz.
    if (this.quizState.gameMode() === 'turn' && this.quizState.quiz() !== null) {
      this.playerState.nextTurn();
    }
    
    this.viewState.set('loading');
    this.selectedAnswer.set(null);
    this.quizState.setCurrentHint(null);
    const config = this.quizState.getQuizConfigRequest();

    if (!config) {
      this.handleError('クイズの設定が見つかりません。');
      return;
    }

    this.apiService.generateQuiz(config)
      .pipe(finalize(() => {
        if (this.viewState() === 'loading') {
          // Handle cases where API completes but doesn't set a state
        }
      }))
      .subscribe({
        next: (quiz) => {
          this.quizState.setCurrentQuiz(quiz);
          this.viewState.set('quiz');
        },
        error: (err) => {
          console.error('Quiz generation failed:', err);
          this.handleError('クイズの生成に失敗しました。AIの応答がないか、サーバーがダウンしている可能性があります。');
        }
      });
  }

  selectAnswer(option: string): void {
    if (this.viewState() !== 'quiz') return;
    this.selectedAnswer.set(option);

    // In turn-based mode, automatically add score if the answer is correct
    const quiz = this.quizState.quiz();
    if (this.quizState.gameMode() === 'turn' && quiz && option === quiz.correctAnswer) {
      const currentPlayer = this.playerState.currentPlayer();
      if (currentPlayer) {
        this.playerState.adjustScore(currentPlayer.id, 1);
      }
    }

    this.viewState.set('answer');
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
        this.viewState.set('quiz'); // Go back to quiz view to show the hint
      },
      error: (err) => {
        console.error('Hint generation failed:', err);
        this.handleError('ヒントの生成に失敗しました。');
      }
    });
  }

  adjustScore(playerId: number, amount: number): void {
    this.playerState.adjustScore(playerId, amount);
  }

  addUser(): void {
    this.router.navigate(['/player-setup']);
  }

  resetGame(): void {
    this.playerState.reset();
    this.quizState.resetQuizState();
    this.router.navigate(['/player-setup']);
  }

  backToSettings(): void {
    this.quizState.resetQuizState(); // Reset quiz state before navigating back
    this.router.navigate(['/game-setup']);
  }

  openQuizResultModal(): void {
    this.dialog.open(QuizResultModal, {
      width: '350px',
      disableClose: true // User must click the button to close
    });
  }

  private handleError(message: string): void {
    this.errorMessage.set(message);
    this.viewState.set('error');
  }
}
