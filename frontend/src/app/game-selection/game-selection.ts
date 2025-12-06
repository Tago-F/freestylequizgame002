import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangeLogDialogComponent } from './change-log-dialog.component';
import { APP_VERSION, CHANGE_LOG } from './change-log.model';

@Component({
  selector: 'app-game-selection',
  imports: [RouterModule, MatButtonModule, MatTooltipModule],
  templateUrl: './game-selection.html',
  styleUrl: './game-selection.css',
  standalone: true,
})
export class GameSelection {
  version = APP_VERSION;

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  navigateToQuiz(): void {
    this.router.navigate(['/quiz/mode']);
  }

  openChangeLog(): void {
    this.dialog.open(ChangeLogDialogComponent, {
      data: { logs: CHANGE_LOG },
      width: '600px',
      maxHeight: '80vh',
    });
  }
}
