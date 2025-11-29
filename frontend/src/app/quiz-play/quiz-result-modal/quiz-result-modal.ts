import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule


@Component({
  selector: 'app-quiz-result-modal',
  standalone: true, // Mark as standalone
  imports: [CommonModule, MatButtonModule], // Add imports here
  templateUrl: './quiz-result-modal.html',
  styleUrl: './quiz-result-modal.css',
})
export class QuizResultModal {
  constructor(
    public dialogRef: MatDialogRef<QuizResultModal>,
    private router: Router
  ) {}

  goToResults(): void {
    this.router.navigate(['/result']);
    this.dialogRef.close();
  }
}
