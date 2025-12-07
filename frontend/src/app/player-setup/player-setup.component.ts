import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlayerStateService } from '../shared/player-state.service';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-player-setup',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  template: `
    <mat-card class="container">
      <mat-card-header>
        <mat-card-title>プレイヤー登録</mat-card-title>
        <mat-card-subtitle>クイズに参加するプレイヤーを登録してください</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <mat-list class="player-list">
          @for (player of playerState.playerList(); track player.id) {
            <mat-list-item>
              <span matListItemAvatar class="player-icon">{{ player.icon }}</span>
              <mat-form-field matListItemLine class="player-name-field">
                <input matInput [(ngModel)]="player.name" (ngModelChange)="updateName(player.id, $event)" placeholder="プレイヤー名">
              </mat-form-field>
              <button mat-icon-button color="warn" (click)="removePlayer(player.id)" matListItemMeta>
                <mat-icon>delete</mat-icon>
              </button>
            </mat-list-item>
          }
        </mat-list>
      </mat-card-content>
      <mat-card-actions class="actions">
        <a mat-stroked-button routerLink="/quiz/mode">
          <mat-icon>arrow_back</mat-icon>
          モード選択に戻る
        </a>
        <span class="spacer"></span>
        <button mat-stroked-button color="primary" (click)="addPlayer()" [disabled]="playerState.playerCount() >= 16">
          <mat-icon>add</mat-icon>
          プレイヤーを追加 ({{ playerState.playerCount() }}/16)
        </button>
        <a mat-raised-button color="primary" routerLink="/quiz/game-setup" [disabled]="playerState.playerCount() === 0">
          設定へ進む
          <mat-icon>arrow_forward</mat-icon>
        </a>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['./player-setup.component.css']
})
export class PlayerSetupComponent {

  constructor(public playerState: PlayerStateService) {}

  addPlayer(): void {
    this.playerState.addPlayer();
  }

  removePlayer(id: string): void {
    this.playerState.removePlayer(id);
  }

  updateName(id: string, event: any): void {
    const newName = typeof event === 'string' ? event : (event.target as HTMLInputElement).value;
    this.playerState.updatePlayerName(id, newName);
  }
}
