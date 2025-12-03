import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenerateQuizRequest, QuizResponse, HintRequest, HintResponse, GameConfigResponse } from './quiz.model';
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
}
