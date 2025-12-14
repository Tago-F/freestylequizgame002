export interface GenerateQuizRequest {
  genre: string;
  difficulty: string;
  timeLimit?: number | null;
  roomName?: string;
  password?: string;
  numberOfQuestions?: number;
  isPrivate?: boolean;
}

export type PlayMode = 'SOLO' | 'HOST' | 'GUEST';

export interface QuizResponse {
  question: string;
  options: string[];
  correctAnswer?: string; // Changed to optional as it might not be sent to client in all cases
  answer?: string; // Backend uses 'answer' sometimes, added for compatibility if needed or mapping
  explanation?: string;
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

export interface GenreCategory {
  name: string;
  genres: string[];
}

export interface GameModeItem {
  key: string;
  displayName: string;
}

export interface GameConfigResponse {
  genreCategories: GenreCategory[];
  difficulties: string[];
  gameModes: GameModeItem[];
}

export type GameStatus = 'WAITING' | 'PLAYING' | 'FINISHED';

export interface Player {
  id: string;
  name: string;
  score: number;
  icon: string;
}

export interface AnswerResult {
  correct: boolean;
  correctAnswer: string;
  newScore: number;
}

export interface GameSession {
  sessionId: string;
  hostPlayerId: string;
  roomName: string;
  players: Player[];
  status: GameStatus;
  currentTurnIndex: number;
  settings: GenerateQuizRequest;
  currentQuiz?: QuizResponse;
  remainingTime: number;
}