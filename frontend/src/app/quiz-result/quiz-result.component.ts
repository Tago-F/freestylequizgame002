import { Component, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { PlayerStateService } from '../shared/player-state.service';
import { QuizStateService } from '../shared/quiz-state.service';
import { Player } from '../shared/player.model';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-quiz-result',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule
  ],
  templateUrl: './quiz-result.component.html',
  styleUrl: './quiz-result.component.css',
})
export class QuizResultComponent {
  public rankedPlayers = computed(() => {
    // Sort players by score in descending order
    return [...this.playerState.playerList()].sort((a, b) => b.score - a.score);
  });

  constructor(
    public playerState: PlayerStateService,
    public quizState: QuizStateService,
    private router: Router
  ) {}

  goToSetup(): void {
    this.quizState.resetQuizState();
    this.router.navigate(['/quiz/game-setup']);
  }

  resetGame(): void {
    this.playerState.reset();
    this.quizState.resetQuizState();
    this.router.navigate(['/quiz/player-setup']);
  }

  addUser(): void {
    this.router.navigate(['/quiz/player-setup']);
  }
}
