import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuizStateService } from '../shared/quiz-state.service';

@Component({
  selector: 'app-game-setup',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <h1>クイズ設定</h1>

      <div class="section">
        <h2>ジャンル:</h2>
        <div class="button-group">
          @for (g of quizState.genres; track g) {
            <button
              [class.selected]="quizState.genre() === g"
              (click)="selectGenre(g)"
            >
              {{ g }}
            </button>
          }
        </div>
      </div>

      <div class="section">
        <h2>難易度:</h2>
        <div class="button-group">
          @for (d of quizState.difficulties; track d) {
            <button
              [class.selected]="quizState.difficulty() === d"
              (click)="selectDifficulty(d)"
            >
              {{ d }}
            </button>
          }
        </div>
      </div>

      <div class="actions">
        <a routerLink="/player-setup" class="back-link">
          ← プレイヤー登録に戻る
        </a>
        <a
          routerLink="/quiz-play"
          class="start-quiz-link"
          [class.disabled]="!quizState.isQuizConfigured()"
        >
          クイズ開始
        </a>
      </div>
    </div>
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
}
