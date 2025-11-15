export interface GenerateQuizRequest {
  genre: string;
  difficulty: string;
}

export interface QuizResponse {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface HintRequest {
  question: string;
  options: string[];
}

export interface HintResponse {
  hint: string;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
