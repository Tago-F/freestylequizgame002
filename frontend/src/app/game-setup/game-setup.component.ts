import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { QuizStateService } from '../shared/quiz-state.service';
import { PlayerStateService } from '../shared/player-state.service';

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
            class="button-group-vertical"
            [value]="quizState.genre()"
            (change)="selectGenre($event.value)">
            @for (category of quizState.genreCategories(); track category.name) {
              <div>
                <h3 class="category-title">{{ category.name }}</h3>
                <div class="button-row">
                  @for (g of category.genres; track g) {
                    <mat-button-toggle [value]="g">{{ g }}</mat-button-toggle>
                  }
                </div>
              </div>
            }
          </mat-button-toggle-group>
        </div>

        <div class="section">
          <h2>難易度</h2>
          <mat-button-toggle-group
            class="button-group"
            [value]="quizState.difficulty()"
            (change)="selectDifficulty($event.value)">
            @for (d of quizState.difficulties(); track d) {
              <mat-button-toggle [value]="d">{{ d }}</mat-button-toggle>
            }
          </mat-button-toggle-group>
        </div>

        <div class="section">
          <h2>制限時間</h2>
          <mat-button-toggle-group
            class="button-group"
            [value]="selectedTimeLimit"
            (change)="selectTimeLimit($event.value)">
            <mat-button-toggle [value]="null">なし</mat-button-toggle>
            <mat-button-toggle [value]="10">10秒</mat-button-toggle>
            <mat-button-toggle [value]="30">30秒</mat-button-toggle>
            <mat-button-toggle [value]="60">60秒</mat-button-toggle>
          </mat-button-toggle-group>
        </div>

        <div class="section">
          <h2>問題数</h2>
          <mat-button-toggle-group
            class="button-group"
            [value]="quizState.totalQuestions()"
            (change)="selectNumberOfQuestions($event.value)">
            <mat-button-toggle [value]="5">5問</mat-button-toggle>
            <mat-button-toggle [value]="15">15問</mat-button-toggle>
            <mat-button-toggle [value]="30">30問</mat-button-toggle>
            <mat-button-toggle [value]="45">45問</mat-button-toggle>
            <mat-button-toggle [value]="infinity">無制限</mat-button-toggle>
          </mat-button-toggle-group>
        </div>
      </mat-card-content>
      <mat-card-actions class="actions">
        <a mat-button routerLink="/quiz/player-setup">
          <mat-icon>arrow_back</mat-icon>
          プレイヤー登録に戻る
        </a>
        <button
          mat-raised-button
          color="primary"
          (click)="startGame()"
          [disabled]="!quizState.isQuizConfigured() || quizState.loading()"
        >
          クイズ開始
          <mat-icon>play_arrow</mat-icon>
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['./game-setup.component.css']
})
export class GameSetupComponent implements OnInit {
  infinity = Infinity; // Expose Infinity to the template
  selectedTimeLimit: number | null = null; // Property to hold the selected time limit

  constructor(
    public quizState: QuizStateService,
    private router: Router,
    public playerState: PlayerStateService
  ) {}

  ngOnInit(): void {
    this.selectedTimeLimit = this.quizState.timeLimit();
  }

  async startGame(): Promise<void> {
    const joinedPlayers = await this.quizState.initializeOnlineGame(this.playerState.playerList());
    
    if (joinedPlayers) {
      // サーバーから返却されたUUID付きのプレイヤー情報で更新
      this.playerState.setPlayers(joinedPlayers);
      this.router.navigate(['/quiz/play']);
    }
  }

  selectGenre(genre: string): void {
    this.quizState.setGenre(genre);
  }

  selectDifficulty(difficulty: string): void {
    this.quizState.setDifficulty(difficulty);
  }

  selectTimeLimit(seconds: number | null): void {
    this.selectedTimeLimit = seconds;
    this.quizState.setTimeLimit(seconds);
  }

  selectNumberOfQuestions(count: number): void {
    this.quizState.setNumberOfQuestions(count);
  }
}