import { Injectable, signal, computed } from '@angular/core';
import { Player } from './player.model';

const ICONS = ['👤', '🤖', '🦊', '🐼', '🐨', '🦁', '🐯', '🐷', '🐸', '🐙'];

@Injectable({
  providedIn: 'root'
})
export class PlayerStateService {
  private players = signal<Player[]>([]);
  private nextPlayerId = 1;

  // Public signals for components to read
  public readonly playerList = this.players.asReadonly();
  public readonly playerCount = computed(() => this.players().length);

  constructor() {
    // Start with one default player
    this.addPlayer();
  }

  addPlayer() {
    if (this.players().length >= 16) {
      return; // Do not add more than 16 players
    }
    const newPlayer: Player = {
      id: this.nextPlayerId++,
      name: `Player ${this.nextPlayerId - 1}`,
      icon: ICONS[(this.nextPlayerId - 2) % ICONS.length],
      score: 0
    };
    this.players.update(currentPlayers => [...currentPlayers, newPlayer]);
  }

  removePlayer(id: number) {
    this.players.update(currentPlayers => currentPlayers.filter(p => p.id !== id));
  }

  updatePlayerName(id: number, newName: string) {
    this.players.update(currentPlayers =>
      currentPlayers.map(p => (p.id === id ? { ...p, name: newName } : p))
    );
  }

  adjustScore(playerId: number, amount: number) {
    this.players.update(currentPlayers =>
      currentPlayers.map(p => (p.id === playerId ? { ...p, score: p.score + amount } : p))
    );
  }

  reset() {
    this.players.set([]);
    this.nextPlayerId = 1;
    this.addPlayer();
  }
}
