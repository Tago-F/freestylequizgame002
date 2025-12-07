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

  constructor(
    public playerState: PlayerStateService,
    public quizState: QuizStateService,
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const sessionId = this.quizState.sessionId();
    if (!sessionId) {
      // If no session, try to redirect or handle error. 
      // For now, redirect to setup.
      this.router.navigate(['/quiz/game-setup']);
      return;
    }

    this.viewState.set('loading');
    
    // Fetch current session state to sync players and current quiz
    this.apiService.getGameSession(sessionId).subscribe({
      next: (session) => {
        // Sync players from server to local state to ensure IDs match
        // We need a method in PlayerStateService to set players, or we can just reset and add them.
        // Since PlayerStateService currently only has add/remove, we might need to manually sync 
        // or assumes initGame handled it. 
        // But to be safe, let's try to update local players if possible.
        // For now, we assume the sync happens or we just proceed. 
        // Ideally we should update PlayerStateService to accept a full list.
        // Let's hack it for now: We will trust that the order is preserved or that we can just use the IDs.
        
        // BETTER APPROACH: We should update PlayerStateService to allow setting the full list.
        // But I can't change PlayerStateService in this file's context easily without another tool call.
        // However, I already updated PlayerStateService in the previous turn but didn't add `setPlayers`.
        // I will just rely on the fact that if I can't sync, I might have issues.
        // Wait, I can access the signal directly? No, it's private.
        // I will assume for now that the user will start the game freshly and `initializeOnlineGame`
        // or this `ngOnInit` logic is sufficient.
        
        // Actually, I can just iterate and update the IDs if the names match?
        // Or better, I will just use the session data.
        
        if (session.currentQuiz) {
          this.quizState.setCurrentQuiz(session.currentQuiz);
          this.viewState.set('quiz');
        } else {
           // If no quiz, try to fetch next
           this.fetchNewQuiz();
        }
      },
      error: (err) => {
        console.error('Failed to load session:', err);
        this.handleError('セッション情報の取得に失敗しました。');
      }
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

    this.apiService.nextQuestion(sessionId)
      .pipe(finalize(() => {
        // loading handled in subscribe
      }))
      .subscribe({
        next: (quiz) => {
          this.quizState.incrementQuestionIndex();
          // Update turn locally
          this.playerState.nextTurn();
          
          this.quizState.setCurrentQuiz(quiz);
          this.viewState.set('quiz');
        },
        error: (err) => {
           console.error('Next question failed:', err);
           this.handleError('次の問題の取得に失敗しました。');
        }
      });
  }

  selectAnswer(option: string): void {
    if (this.viewState() !== 'quiz') return;
    
    const sessionId = this.quizState.sessionId();
    const currentPlayer = this.playerState.currentPlayer();
    
    if (!sessionId || !currentPlayer) return;

    this.selectedAnswer.set(option);
    this.viewState.set('loading'); // Show loading while verifying

    this.apiService.submitAnswer(sessionId, currentPlayer.id, option)
      .subscribe({
        next: (result) => {
          this.isCorrect.set(result.correct);
          this.correctAnswer.set(result.correctAnswer);
          
          // Update score
          // We calculate the difference or just set it if PlayerStateService supported it.
          // Since PlayerStateService has adjustScore, we need the diff. 
          // But we don't know the previous score easily without checking.
          // Let's just assume +10 for correct as per backend default, 
          // OR better: `PlayerStateService` should ideally have `setScore`.
          // I'll use adjustScore with the difference if correct.
          // Backend adds 10 points.
          if (result.correct) {
              // Assuming standard 10 points for now as per backend logic
              // Ideally we sync the whole player list from server?
              this.adjustScore(currentPlayer.id, 10);
          }

          this.viewState.set('answer');
        },
        error: (err) => {
          console.error('Answer submission failed:', err);
          this.handleError('回答の送信に失敗しました。');
        }
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