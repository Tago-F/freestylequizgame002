import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { QuizStateService } from '../shared/quiz-state.service';
import { PlayerStateService } from '../shared/player-state.service'; // Added
import { GameSession } from '../shared/quiz.model';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatButtonModule, MatIconModule],
  template: `
    <div class="room-list-container">
      <h2>Select a Room to Join</h2>
      
      <div *ngIf="loading" class="loading-indicator">
        Loading rooms...
      </div>

      <div *ngIf="!loading && sessions.length === 0" class="no-rooms-message">
        No active rooms found. Why not create one?
      </div>

      <mat-card *ngFor="let session of sessions" class="room-card">
        <mat-card-header>
          <mat-card-title>{{ session.roomName || 'Untitled Room' }}</mat-card-title>
          <mat-card-subtitle>Host ID: {{ session.hostPlayerId }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>Genre: {{ session.settings.genre || 'Random' }}</p>
          <p>Players: {{ session.players.length }}</p>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-raised-button color="primary" (click)="joinRoom(session)">
            Join
          </button>
        </mat-card-actions>
      </mat-card>
      
      <div class="actions">
        <button mat-button (click)="goBack()">Back to Menu</button>
      </div>
    </div>
  `,
  styles: [`
    .room-list-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 1rem;
    }
    .room-card {
      margin-bottom: 1rem;
    }
    .loading-indicator, .no-rooms-message {
      text-align: center;
      margin: 2rem 0;
      color: #666;
    }
    .actions {
      margin-top: 1rem;
      text-align: center;
    }
  `]
})
export class RoomListComponent implements OnInit {
  sessions: GameSession[] = [];
  loading = false;
  
  private apiService = inject(ApiService);
  private quizStateService = inject(QuizStateService);
  private playerStateService = inject(PlayerStateService); // Added
  private router = inject(Router);

  ngOnInit() {
    this.loadSessions();
  }

  loadSessions() {
    this.loading = true;
    this.apiService.getAvailableSessions().subscribe({
      next: (data) => {
        this.sessions = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load sessions', err);
        this.loading = false;
      }
    });
  }

  async joinRoom(session: GameSession) {
    console.log('Joining room:', session.sessionId);
    // Use the first player info as "myself" (assuming set up in previous screen)
    const me = this.playerStateService.playerList()[0];
    if (me) {
        await this.quizStateService.joinGame(session.sessionId, me.name, me.icon);
    } else {
        // Fallback or error if no player set up
        console.error("No player information found. Please set up player profile.");
        this.router.navigate(['/quiz/player-setup']);
    }
  }

  goBack() {
    this.router.navigate(['/game-selection']);
  }
}
