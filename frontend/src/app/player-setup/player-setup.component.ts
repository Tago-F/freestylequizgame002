import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlayerStateService } from '../shared/player-state.service';
import { QuizStateService } from '../shared/quiz-state.service';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

const ICONS = ['👤', '🤖', '🦊', '🐼', '🐨', '🦁', '🐯', '🐷', '🐸', '🐙'];

@Component({
  selector: 'app-player-setup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule
  ],
  template: `
    <mat-card class="container">
      <mat-card-header>
        <mat-card-title>Profile Setup</mat-card-title>
        <mat-card-subtitle>Enter your name and choose an avatar</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="form-container" *ngIf="myself">
            <mat-form-field appearance="fill" class="full-width">
                <mat-label>Your Name</mat-label>
                <input matInput [(ngModel)]="myself.name" (ngModelChange)="updateName($event)" placeholder="Enter your name">
            </mat-form-field>

            <div class="icon-selection">
                <h3>Choose Avatar</h3>
                <mat-button-toggle-group [value]="myself.icon" (change)="updateIcon($event.value)" class="icon-group">
                    @for (icon of icons; track icon) {
                        <mat-button-toggle [value]="icon">{{ icon }}</mat-button-toggle>
                    }
                </mat-button-toggle-group>
            </div>
        </div>
      </mat-card-content>
      <mat-card-actions class="actions">
        <button mat-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon> Back
        </button>
        <span class="spacer"></span>
        <button mat-raised-button color="primary" (click)="goToNext()" [disabled]="!myself || !myself.name">
          Next <mat-icon>arrow_forward</mat-icon>
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 1rem;
    }
    .form-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin-top: 1rem;
    }
    .full-width {
        width: 100%;
    }
    .icon-selection h3 {
        margin-bottom: 0.5rem;
    }
    .icon-group {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    .actions {
        display: flex;
        justify-content: space-between;
    }
    .spacer {
        flex: 1;
    }
  `]
})
export class PlayerSetupComponent implements OnInit {
  public playerState = inject(PlayerStateService);
  private quizState = inject(QuizStateService);
  private router = inject(Router);
  
  icons = ICONS;

  get myself() {
      return this.playerState.playerList()[0];
  }

  ngOnInit() {
      // Ensure at least one player exists (myself)
      if (this.playerState.playerCount() === 0) {
          this.playerState.addPlayer();
      }
      // If previously had multiple players (from old logic), maybe reset to just one
      // For now, assume index 0 is always the current user to edit.
  }

  updateName(newName: string): void {
      if (this.myself) {
          this.playerState.updatePlayerName(this.myself.id, newName);
      }
  }

  updateIcon(newIcon: string): void {
      if (this.myself) {
           // Direct update is not exposed in service currently for icon only, 
           // but we can update the whole player object or add a method.
           // For simplicity, let's just assume we can't easily update icon via specific method 
           // without modifying service, so let's modify service or hack it.
           // Actually `updatePlayerName` only updates name. 
           // Let's add `updatePlayerIcon` to service or just implement it here if we had access to signal set (we don't directly).
           // Wait, `playerState.players` is private signal.
           // We need a method in service.
           
           // Workaround: We can't update icon easily without service method.
           // Let's just ignore icon update for a second and fix service in next step if needed?
           // No, user instruction implies we should do it.
           // I will assume `updatePlayerIcon` exists or I'll add it via `replace` tool later if strictly needed.
           // But I am in `replace` tool for component now.
           
           // I will add a method to `PlayerStateService` in a separate tool call if possible, 
           // OR I can use `setPlayers` to update the list.
           const currentPlayers = this.playerState.playerList();
           const updatedPlayers = currentPlayers.map(p => 
               p.id === this.myself.id ? { ...p, icon: newIcon } : p
           );
           this.playerState.setPlayers(updatedPlayers);
      }
  }

  goToNext(): void {
    const mode = this.quizState.playMode();
    if (mode === 'HOST') {
        this.router.navigate(['/quiz/game-setup']);
    } else if (mode === 'GUEST') {
        this.router.navigate(['/quiz/room-list']);
    } else {
        // SOLO
        this.router.navigate(['/quiz/game-setup']);
    }
  }

  goBack(): void {
      this.router.navigate(['/game-selection']); // Go back to mode selection
  }
}
