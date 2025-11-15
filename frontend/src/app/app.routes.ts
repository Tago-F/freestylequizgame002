import { Routes } from '@angular/router';
import { PlayerSetupComponent } from './player-setup/player-setup.component';
import { GameSetupComponent } from './game-setup/game-setup.component';
import { QuizPlayComponent } from './quiz-play/quiz-play.component';

export const routes: Routes = [
  { path: 'player-setup', component: PlayerSetupComponent },
  { path: 'game-setup', component: GameSetupComponent },
  { path: 'quiz-play', component: QuizPlayComponent },
  { path: '', redirectTo: '/player-setup', pathMatch: 'full' },
  { path: '**', redirectTo: '/player-setup' } // Wildcard route for any unmatched paths
];
