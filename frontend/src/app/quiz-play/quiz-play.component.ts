import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quiz-play',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2>クイズプレイ画面</h2>
    <p>ここはクイズプレイ画面のプレースホルダーです。</p>
    <a routerLink="/player-setup">ゲームをリセット</a>
  `,
  styles: []
})
export class QuizPlayComponent {

}
