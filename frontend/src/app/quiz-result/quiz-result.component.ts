import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { PlayerStateService } from '../shared/player-state.service';
import { QuizStateService } from '../shared/quiz-state.service';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-quiz-result',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule
  ],
  template: `
    <div class="result-container">
      <mat-toolbar color="primary" class="toolbar">
        <span>Game Over</span>
      </mat-toolbar>

      <div class="content">
        <mat-card class="result-card">
          <mat-card-header>
            <mat-card-title>Final Results</mat-card-title>
            <mat-card-subtitle>Thank you for playing!</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item *ngFor="let player of rankedPlayers(); let i = index" 
                             [class.winner]="i === 0"
                             [class.my-player]="player.id === playerState.myPlayerId()">
                <mat-icon matListItemIcon *ngIf="i === 0" class="crown-icon">emoji_events</mat-icon>
                <span matListItemIcon *ngIf="i > 0" class="rank-number">{{ i + 1 }}</span>
                
                <div matListItemTitle class="player-info">
                   <span class="player-icon">{{ player.icon }}</span>
                   <span class="player-name">{{ player.name }}</span>
                   <span *ngIf="player.id === playerState.myPlayerId()">(You)</span>
                </div>
                <div matListItemMeta class="score-display">
                  {{ player.score }} pts
                </div>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-raised-button color="warn" (click)="leaveGame()">
              <mat-icon>home</mat-icon> Back to Menu
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .result-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .content {
      padding: 2rem;
      display: flex;
      justify-content: center;
      background-color: #f5f5f5;
      flex: 1;
    }
    .result-card {
      width: 100%;
      max-width: 600px;
    }
    .winner {
      background-color: #fff8e1; /* Light gold background for winner */
    }
    .my-player {
      font-weight: bold;
    }
    .crown-icon {
      color: gold;
    }
    .rank-number {
      font-size: 1.2rem;
      font-weight: bold;
      color: #757575;
      width: 24px;
      text-align: center;
      display: inline-block;
    }
    .player-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .score-display {
      font-size: 1.2rem;
      font-weight: 500;
    }
  `]
})
export class QuizResultComponent {
  public playerState = inject(PlayerStateService);
  public quizState = inject(QuizStateService);
  private router = inject(Router);

  public rankedPlayers = computed(() => {
    // Sort players by score in descending order
    return [...this.playerState.playerList()].sort((a, b) => b.score - a.score);
  });
  
  get isHost(): boolean {
      return this.quizState.hostPlayerId() === this.playerState.myPlayerId();
  }

  leaveGame(): void {
    if (this.isHost) {
        this.quizState.endGame();
    } else {
        this.quizState.leaveGame();
    }
  }
}