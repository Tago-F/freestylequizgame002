import { Component, OnInit, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlayerStateService } from '../shared/player-state.service';
import { QuizStateService } from '../shared/quiz-state.service';
import { ApiService } from '../shared/api.service';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

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
    MatChipsModule
  ],
  template: `
    <div class="game-container">
      <mat-toolbar color="primary" class="toolbar">
        <span>Room: {{ quizState.sessionId() }}</span>
        <span class="spacer"></span>
        <span *ngIf="quizState.remainingTime() !== null" class="timer">
          Time: {{ quizState.remainingTime() }}s
        </span>
      </mat-toolbar>

      <div class="content">
        <!-- Loading State -->
        <div *ngIf="quizState.loading()" class="center-content">
          <mat-spinner></mat-spinner>
          <p>Loading...</p>
        </div>

        <!-- Quiz Question State -->
        <div *ngIf="!quizState.loading() && !showResult && quizState.quiz()" class="quiz-content">
          <mat-card class="question-card">
            <mat-card-header>
              <mat-card-title>Question {{ quizState.questionIndex() + 1 }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p class="question-text">{{ quizState.quiz()?.question }}</p>
              
              <div *ngIf="quizState.hint()" class="hint-box">
                <strong>Hint:</strong> {{ quizState.hint()?.hint }}
              </div>
            </mat-card-content>
            <mat-card-actions>
               <button mat-button color="accent" (click)="getHint()" [disabled]="hasUsedHint || quizState.loading()">
                 <mat-icon>lightbulb</mat-icon> Use Hint
               </button>
            </mat-card-actions>
          </mat-card>

          <div class="options-grid">
            <button *ngFor="let option of quizState.quiz()?.options"
                    mat-raised-button
                    class="option-btn"
                    (click)="submitAnswer(option)"
                    [disabled]="hasSubmitted">
              {{ option }}
            </button>
          </div>
        </div>

        <!-- Result State -->
        <div *ngIf="showResult" class="result-content">
           <mat-card [ngClass]="{'correct-card': isCorrect, 'incorrect-card': !isCorrect}">
             <mat-card-header>
               <mat-card-title>
                 <mat-icon>{{ isCorrect ? 'check_circle' : 'cancel' }}</mat-icon>
                 {{ isCorrect ? 'Correct!' : 'Incorrect' }}
               </mat-card-title>
             </mat-card-header>
             <mat-card-content>
               <p><strong>Correct Answer:</strong> {{ correctAnswer }}</p>
               <p *ngIf="quizState.quiz()?.explanation">
                 <strong>Explanation:</strong> {{ quizState.quiz()?.explanation }}
               </p>
               <div class="score-update">
                  Current Score: {{ playerState.currentPlayer()?.score }}
               </div>
             </mat-card-content>
             <mat-card-actions *ngIf="isHost">
               <button mat-raised-button color="primary" (click)="nextQuestion()">Next Question</button>
             </mat-card-actions>
             <mat-card-actions *ngIf="!isHost">
               <p>Waiting for host...</p>
             </mat-card-actions>
           </mat-card>
        </div>

        <!-- Players List (Sidebar or Bottom) -->
        <div class="players-section">
          <h3>Players</h3>
          <mat-chip-listbox>
            <mat-chip *ngFor="let p of playerState.playerList()" [highlighted]="p.id === playerState.myPlayerId()">
                {{ p.icon }} {{ p.name }}: {{ p.score }}
            </mat-chip>
          </mat-chip-listbox>
        </div>
        
        <div class="footer-actions">
            <button mat-button color="warn" (click)="leaveGame()">Leave Game</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .game-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .timer {
      font-weight: bold;
      font-size: 1.2rem;
    }
    .content {
      padding: 1rem;
      flex: 1;
      overflow-y: auto;
      max-width: 800px;
      margin: 0 auto;
      width: 100%;
    }
    .center-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
    }
    .question-card {
      margin-bottom: 2rem;
    }
    .question-text {
      font-size: 1.2rem;
      font-weight: 500;
      margin: 1rem 0;
    }
    .hint-box {
      background: #fff3e0;
      padding: 0.5rem;
      border-radius: 4px;
      margin-top: 1rem;
    }
    .options-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
    .option-btn {
      height: 60px;
      font-size: 1.1rem;
    }
    .correct-card {
      background-color: #e8f5e9;
    }
    .incorrect-card {
      background-color: #ffebee;
    }
    .players-section {
      margin-top: 2rem;
      border-top: 1px solid #eee;
      padding-top: 1rem;
    }
    .footer-actions {
        margin-top: 1rem;
        text-align: center;
    }
  `]
})
export class QuizPlayComponent implements OnInit {
  hasUsedHint = false;
  hasSubmitted = false;
  showResult = false;
  isCorrect = false;
  correctAnswer = '';

  private apiService = inject(ApiService);
  public quizState = inject(QuizStateService);
  public playerState = inject(PlayerStateService);
  private router = inject(Router);

  get isHost(): boolean {
    return this.quizState.hostPlayerId() === this.playerState.myPlayerId();
  }

  constructor() {
    effect(() => {
       // Reset state when new quiz arrives
       if (this.quizState.quiz()) {
           this.hasUsedHint = false;
           this.hasSubmitted = false;
           this.showResult = false;
       }
       
       // Handle timer expiration
       if (this.quizState.remainingTime() === 0 && !this.showResult) {
           // Time up handling, maybe switch to result view if not already
           // Ideally backend sends result or we just show timeout
       }
    });
  }

  ngOnInit(): void {
    if (!this.quizState.sessionId()) {
      this.router.navigate(['/game-selection']);
      return;
    }

    // Subscribe to result updates
    this.quizState.answerResult$.subscribe(result => {
        this.isCorrect = result.correct;
        this.correctAnswer = result.correctAnswer;
        this.showResult = true;
        
        // Update score in local state
        // Note: Ideally backend broadcasts updated player list, which updates playerState automatically via WebSocket
        // But we can also update locally for immediate feedback if needed, 
        // though playerStateService.setPlayers() is called by WS updates in QuizStateService.
    });
  }

  getHint() {
    this.hasUsedHint = true;
    this.quizState.generateHint();
  }

  submitAnswer(answer: string) {
    if (this.hasSubmitted) return;
    this.hasSubmitted = true;
    
    const sessionId = this.quizState.sessionId();
    const playerId = this.playerState.myPlayerId();
    
    if (sessionId && playerId) {
        this.apiService.submitAnswer(sessionId, playerId, answer, this.hasUsedHint).subscribe({
            error: (err) => console.error("Submit answer failed", err)
        });
    }
  }

  nextQuestion() {
      const sessionId = this.quizState.sessionId();
      if (sessionId) {
          this.apiService.nextQuestion(sessionId).subscribe({
              error: (err) => console.error("Next question failed", err)
          });
      }
  }

  leaveGame() {
      if (this.isHost) {
          this.quizState.endGame();
      } else {
          this.quizState.leaveGame();
      }
  }
}
