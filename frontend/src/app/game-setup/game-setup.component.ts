import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-setup',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2>クイズ設定画面</h2>
    <p>ここはクイズ設定画面のプレースホルダーです。</p>
    <a routerLink="/player-setup">← プレイヤー登録に戻る</a>
    <a routerLink="/quiz-play">クイズ開始</a>
  `,
  styles: []
})
export class GameSetupComponent {

}
