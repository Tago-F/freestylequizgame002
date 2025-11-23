import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-game-selection',
  imports: [RouterModule],
  templateUrl: './game-selection.html',
  styleUrl: './game-selection.css',
  standalone: true,
})
export class GameSelection {
  constructor(private router: Router) {}

  navigateToQuiz(): void {
    this.router.navigate(['/player-setup']);
  }
}
