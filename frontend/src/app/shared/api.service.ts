import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenerateQuizRequest, QuizResponse, HintRequest, HintResponse, GameConfigResponse, Player, GameSession, AnswerResult } from './quiz.model';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = `${environment.apiUrl}/api/v1`; // Updated base URL to v1 root

  constructor(private http: HttpClient) { }

  getGameConfig(): Observable<GameConfigResponse> {
    return this.http.get<GameConfigResponse>(`${this.baseUrl}/game/config`);
  }

  generateQuiz(request: GenerateQuizRequest): Observable<QuizResponse> {
    return this.http.post<QuizResponse>(`${this.baseUrl}/quiz/generate`, request);
  }

  generateHint(request: HintRequest): Observable<HintResponse> {
    return this.http.post<HintResponse>(`${this.baseUrl}/quiz/hint`, request);
  }

  createGameSession(settings: GenerateQuizRequest): Observable<{sessionId: string}> {
    return this.http.post<{sessionId: string}>(`${this.baseUrl}/game/create`, settings);
  }

  joinGameSession(sessionId: string, playerName: string, icon: string, password?: string): Observable<Player> {
    return this.http.post<Player>(`${this.baseUrl}/game/${sessionId}/join`, { playerName, icon, password });
  }

  startGame(sessionId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/game/${sessionId}/start`, {});
  }

  getGameSession(sessionId: string): Observable<GameSession> {
    return this.http.get<GameSession>(`${this.baseUrl}/game/${sessionId}`);
  }
  
  getAvailableSessions(): Observable<GameSession[]> {
    return this.http.get<GameSession[]>(`${this.baseUrl}/game/sessions`);
  }

  submitAnswer(sessionId: string, playerId: string, answer: string, usedHint: boolean): Observable<AnswerResult> {
    return this.http.post<AnswerResult>(`${this.baseUrl}/game/${sessionId}/answer`, { playerId, answer, usedHint });
  }

  nextQuestion(sessionId: string): Observable<QuizResponse> {
    return this.http.post<QuizResponse>(`${this.baseUrl}/game/${sessionId}/next`, {});
  }

  leaveSession(sessionId: string, playerId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/game/${sessionId}/leave`, playerId);
  }

  endSession(sessionId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/game/${sessionId}/end`, {});
  }
}
