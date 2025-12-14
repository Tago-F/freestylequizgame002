import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { QuizStateService } from '../shared/quiz-state.service';
import { PlayerStateService } from '../shared/player-state.service';

@Component({
  selector: 'app-waiting-room',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="waiting-room-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Waiting Room</mat-card-title>
          <mat-card-subtitle>Room ID: {{ quizState.sessionId() }}</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="status-message" *ngIf="!isHost">
            <mat-spinner diameter="30"></mat-spinner>
            <p>Waiting for host to start the game...</p>
          </div>
          
          <div class="status-message" *ngIf="isHost">
            <p>You are the host. Start when ready!</p>
          </div>

          <h3>Players ({{ playerState.playerCount() }})</h3>
          <mat-list>
            <mat-list-item *ngFor="let player of playerState.playerList()">
              <mat-icon matListItemIcon>{{ player.icon || 'person' }}</mat-icon>
              <div matListItemTitle>{{ player.name }}</div>
              <div matListItemLine *ngIf="player.id === playerState.myPlayerId()">(You)</div>
              <div matListItemLine *ngIf="player.id === quizState.hostPlayerId()">(Host)</div>
            </mat-list-item>
          </mat-list>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-button color="warn" (click)="leaveRoom()">Leave</button>
          <button *ngIf="isHost" mat-raised-button color="primary" (click)="startGame()" [disabled]="quizState.loading()">
            Start Game
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .waiting-room-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 1rem;
    }
    .status-message {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 1rem 0;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 4px;
    }
  `]
})
export class WaitingRoomComponent implements OnInit {
  private router = inject(Router);
  private apiService = inject(ApiService);
  public quizState = inject(QuizStateService);
  public playerState = inject(PlayerStateService);

  get isHost(): boolean {
    return this.quizState.hostPlayerId() === this.playerState.myPlayerId();
  }

  ngOnInit() {
    if (!this.quizState.sessionId()) {
      this.router.navigate(['/game-selection']);
    }
  }

  startGame() {
    const sessionId = this.quizState.sessionId();
    if (sessionId) {
      this.apiService.startGame(sessionId).subscribe({
        error: (err) => console.error('Failed to start game', err)
      });
    }
  }

  leaveRoom() {
    // Ideally we should call an API to leave, but for now just navigate back
    this.quizState.resetQuizState();
    this.playerState.reset();
    this.router.navigate(['/game-selection']);
  }
}
