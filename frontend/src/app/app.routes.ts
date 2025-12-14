import { Routes } from '@angular/router';
import { PlayerSetupComponent } from './player-setup/player-setup.component';
import { GameSetupComponent } from './game-setup/game-setup.component';
import { QuizPlayComponent } from './quiz-play/quiz-play.component';
import { GameSelection } from './game-selection/game-selection';
import { QuizResultComponent } from './quiz-result/quiz-result.component';
import { ModeSelectionComponent } from './mode-selection/mode-selection.component'; // ModeSelectionComponentのインポートを追加
import { RoomListComponent } from './room-list/room-list.component';

export const routes: Routes = [
  { path: 'game-selection', component: GameSelection },
  {
    path: 'quiz', // クイズ機能に関連するルートを/quiz配下に階層化
    children: [
      { path: 'mode', component: ModeSelectionComponent },
      { path: 'room-list', component: RoomListComponent }, // New route for room list
      { path: 'player-setup', component: PlayerSetupComponent },
      { path: 'game-setup', component: GameSetupComponent },
      { path: 'play', component: QuizPlayComponent }, // パス名を'play'に変更
      { path: 'result', component: QuizResultComponent },
    ]
  },
  { path: '', redirectTo: '/game-selection', pathMatch: 'full' },
  { path: '**', redirectTo: '/game-selection' }
];
