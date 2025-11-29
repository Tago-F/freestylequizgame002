import { Routes } from '@angular/router';
import { PlayerSetupComponent } from './player-setup/player-setup.component';
import { GameSetupComponent } from './game-setup/game-setup.component';
import { QuizPlayComponent } from './quiz-play/quiz-play.component';
import { GameSelection } from './game-selection/game-selection';
import { QuizResultComponent } from './quiz-result/quiz-result.component'; // Import QuizResultComponent

export const routes: Routes = [
  { path: 'game-selection', component: GameSelection },
  { path: 'player-setup', component: PlayerSetupComponent },
  { path: 'game-setup', component: GameSetupComponent },
  { path: 'quiz-play', component: QuizPlayComponent },
  { path: 'result', component: QuizResultComponent }, // New route for QuizResultComponent
  { path: '', redirectTo: '/game-selection', pathMatch: 'full' },
  { path: '**', redirectTo: '/game-selection' } // Wildcard route for any unmatched paths
];
