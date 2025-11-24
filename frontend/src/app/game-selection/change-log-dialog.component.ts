import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Changelog } from './change-log.model';

@Component({
  selector: 'app-change-log-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './change-log-dialog.component.html',
  styleUrls: ['./change-log-dialog.component.scss']
})
export class ChangeLogDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ChangeLogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { logs: Changelog[] }
  ) {}

  // "added" や "changed" などのキーを配列として取得するヘルパー関数
  getChangeCategories(changes: Changelog['changes']): Array<keyof Changelog['changes']> {
    return Object.keys(changes) as Array<keyof Changelog['changes']>;
  }

  close(): void {
    this.dialogRef.close();
  }
}
