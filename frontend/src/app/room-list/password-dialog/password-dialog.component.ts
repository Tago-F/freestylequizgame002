import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>Password Required</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill" style="width: 100%">
        <mat-label>Password</mat-label>
        <input matInput type="password" [(ngModel)]="password" (keyup.enter)="join()">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="join()" [disabled]="!password">Join</button>
    </mat-dialog-actions>
  `
})
export class PasswordDialogComponent {
  password = '';

  constructor(public dialogRef: MatDialogRef<PasswordDialogComponent>) {}

  cancel(): void {
    this.dialogRef.close();
  }

  join(): void {
    this.dialogRef.close(this.password);
  }
}
