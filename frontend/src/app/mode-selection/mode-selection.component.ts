import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mode-selection',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './mode-selection.component.html',
  styleUrls: ['./mode-selection.component.css']
})
export class ModeSelectionComponent {

  constructor(private router: Router) {}

  onSelectMode(mode: string): void {
    console.log(`Selected mode: ${mode}`);
    // Navigate to player setup. 
    // Note: Ensure the route '/quiz/player-setup' is defined in your app.routes.ts
    this.router.navigate(['/quiz/player-setup']);
  }
}
