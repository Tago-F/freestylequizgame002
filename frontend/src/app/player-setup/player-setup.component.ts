import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlayerStateService } from '../shared/player-state.service';
import { Player } from '../shared/player.model';

@Component({
  selector: 'app-player-setup',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <h1>プレイヤー登録</h1>
      <div class="player-list">
        @for (player of playerState.playerList(); track player.id) {
          <div class="player-item">
            <span class="player-icon">{{ player.icon }}</span>
            <input type="text" [(ngModel)]="player.name" (ngModelChange)="updateName(player.id, $event)" placeholder="プレイヤー名">
            <button (click)="removePlayer(player.id)" class="delete-btn">削除</button>
          </div>
        }
      </div>

      <div class="actions">
        <button (click)="addPlayer()" [disabled]="playerState.playerCount() >= 16">
          ＋ プレイヤーを追加 ({{ playerState.playerCount() }}/16)
        </button>
        <a routerLink="/game-setup" class="next-link" [class.disabled]="playerState.playerCount() === 0">
          設定へ進む
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./player-setup.component.css']
})
export class PlayerSetupComponent {

  constructor(public playerState: PlayerStateService) {}

  addPlayer(): void {
    this.playerState.addPlayer();
  }

  removePlayer(id: number): void {
    this.playerState.removePlayer(id);
  }

  updateName(id: number, event: any): void {
    // ngModelChange can sometimes pass the event object, ensure we get the value.
    const newName = typeof event === 'string' ? event : (event.target as HTMLInputElement).value;
    this.playerState.updatePlayerName(id, newName);
  }
}
