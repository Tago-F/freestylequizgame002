import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { QuizStateService } from '../shared/quiz-state.service';
import { PlayMode } from '../shared/quiz.model';

@Component({
  selector: 'app-mode-selection',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="mode-selection-container">
      <mat-card class="mode-card">
        <mat-card-header>
          <mat-card-title>モード選択</mat-card-title>
          <mat-card-subtitle>プレイモードを選択してください</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="button-container">
          <!-- Solo Play -->
          <button mat-raised-button color="primary" class="mode-button" (click)="selectMode('SOLO')">
            <mat-icon>person</mat-icon>
            <div class="button-text">
              <span class="title">ソロプレイ</span>
              <span class="subtitle">一人でクイズを楽しむ</span>
            </div>
          </button>

          <!-- Host Room -->
          <button mat-raised-button color="accent" class="mode-button" (click)="selectMode('HOST')">
            <mat-icon>meeting_room</mat-icon>
            <div class="button-text">
              <span class="title">部屋を作成 (Host)</span>
              <span class="subtitle">友達を招待して遊ぶ</span>
            </div>
          </button>

          <!-- Join Room -->
          <button mat-raised-button class="mode-button guest-button" (click)="selectMode('GUEST')">
            <mat-icon>login</mat-icon>
            <div class="button-text">
              <span class="title">部屋を探す (Guest)</span>
              <span class="subtitle">募集中の部屋に参加する</span>
            </div>
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .mode-selection-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .mode-card {
      width: 100%;
      max-width: 400px;
      padding: 1rem;
    }
    .button-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }
    .mode-button {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 1.5rem;
      font-size: 1rem;
    }
    .mode-button mat-icon {
      margin-right: 1rem;
      transform: scale(1.5);
    }
    .button-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1.2;
    }
    .title {
      font-weight: bold;
      font-size: 1.1rem;
    }
    .subtitle {
      font-size: 0.85rem;
      opacity: 0.9;
    }
    .guest-button {
      background-color: #4caf50; /* Green color for guest */
      color: white;
    }
  `]
})
export class ModeSelectionComponent {
  private quizState = inject(QuizStateService);
  private router = inject(Router);

  selectMode(mode: PlayMode): void {
    this.quizState.setPlayMode(mode);
    if (mode === 'SOLO') {
      this.router.navigate(['/quiz/game-setup']);
    } else {
      this.router.navigate(['/quiz/player-setup']);
    }
  }
}