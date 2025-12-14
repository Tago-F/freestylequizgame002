import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Added
import { QuizStateService } from '../shared/quiz-state.service';
import { PlayerStateService } from '../shared/player-state.service';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input'; // Added
import { MatFormFieldModule } from '@angular/material/form-field'; // Added

@Component({
  selector: 'app-game-setup',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule, // Added
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatInputModule, // Added
    MatFormFieldModule // Added
  ],
  template: `
    <mat-card class="container">
      <mat-card-header>
        <mat-card-title>Create Room</mat-card-title>
        <mat-card-subtitle>Configure your game session</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
      
        <div class="section">
            <mat-form-field appearance="fill" class="full-width">
                <mat-label>Room Name</mat-label>
                <input matInput [(ngModel)]="roomName" placeholder="Enter room name">
            </mat-form-field>
        </div>

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
          (click)="createRoom()"
          [disabled]="!quizState.isQuizConfigured() || quizState.loading() || !roomName"
        >
          ルームを作成 (Create Room)
          <mat-icon>add_circle</mat-icon>
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['./game-setup.component.css']
})
export class GameSetupComponent implements OnInit {
  infinity = Infinity; // Expose Infinity to the template
  selectedTimeLimit: number | null = null; // Property to hold the selected time limit
  roomName: string = '';

  constructor(
    public quizState: QuizStateService,
    private router: Router,
    public playerState: PlayerStateService
  ) {}

  ngOnInit(): void {
    this.selectedTimeLimit = this.quizState.timeLimit();
  }

  async createRoom(): Promise<void> {
    const settings = this.quizState.getQuizConfigRequest();
    if (settings) {
        settings.roomName = this.roomName;
        // Assume first player is the host (myself)
        const me = this.playerState.playerList()[0]; 
        if (me) {
            await this.quizState.hostGame(settings, me.name, me.icon);
        }
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