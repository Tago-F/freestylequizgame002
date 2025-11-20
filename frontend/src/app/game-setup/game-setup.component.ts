import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuizStateService, GameMode } from '../shared/quiz-state.service';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-game-setup',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule
  ],
  template: `
    <mat-card class="container">
      <mat-card-header>
        <mat-card-title>クイズ設定</mat-card-title>
        <mat-card-subtitle>挑戦したいクイズのジャンルと難易度を選択してください</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="section">
          <h2>ジャンル</h2>
          <mat-button-toggle-group
            class="button-group"
            [value]="quizState.genre()"
            (change)="selectGenre($event.value)">
            @for (g of quizState.genres; track g) {
              <mat-button-toggle [value]="g">{{ g }}</mat-button-toggle>
            }
          </mat-button-toggle-group>
        </div>

        <div class="section">
          <h2>難易度</h2>
          <mat-button-toggle-group
            class="button-group"
            [value]="quizState.difficulty()"
            (change)="selectDifficulty($event.value)">
            @for (d of quizState.difficulties; track d) {
              <mat-button-toggle [value]="d">{{ d }}</mat-button-toggle>
            }
          </mat-button-toggle-group>
        </div>

        <div class="section">
          <h2>ゲームモード</h2>
          <mat-button-toggle-group
            class="button-group"
            [value]="quizState.gameMode()"
            (change)="selectGameMode($event.value)">
            <mat-button-toggle value="all">全員回答モード</mat-button-toggle>
            <mat-button-toggle value="turn">ターン制モード</mat-button-toggle>
          </mat-button-toggle-group>
        </div>
      </mat-card-content>
      <mat-card-actions class="actions">
        <a mat-button routerLink="/player-setup">
          <mat-icon>arrow_back</mat-icon>
          プレイヤー登録に戻る
        </a>
        <a
          mat-raised-button
          color="primary"
          routerLink="/quiz-play"
          [disabled]="!quizState.isQuizConfigured()"
        >
          クイズ開始
          <mat-icon>play_arrow</mat-icon>
        </a>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['./game-setup.component.css']
})
export class GameSetupComponent {
  constructor(public quizState: QuizStateService) {}

  selectGenre(genre: string): void {
    this.quizState.setGenre(genre);
  }

  selectDifficulty(difficulty: string): void {
    this.quizState.setDifficulty(difficulty);
  }

  selectGameMode(mode: string): void {
    this.quizState.setGameMode(mode as GameMode);
  }
}
