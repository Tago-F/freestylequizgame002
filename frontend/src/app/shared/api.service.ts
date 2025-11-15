import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenerateQuizRequest, QuizResponse, HintRequest, HintResponse } from './quiz.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api/v1/quiz'; // Base URL for the Spring Boot API

  constructor(private http: HttpClient) { }

  generateQuiz(request: GenerateQuizRequest): Observable<QuizResponse> {
    return this.http.post<QuizResponse>(`${this.baseUrl}/generate`, request);
  }

  generateHint(request: HintRequest): Observable<HintResponse> {
    return this.http.post<HintResponse>(`${this.baseUrl}/hint`, request);
  }
}
