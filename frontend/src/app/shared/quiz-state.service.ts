import { Injectable, signal, computed } from '@angular/core';
import { GenerateQuizRequest, QuizResponse, HintResponse } from './quiz.model';

export type GameMode = 'all' | 'turn';

export interface GenreCategory {
  name: string;
  genres: string[];
}

@Injectable({
  providedIn: 'root'
})
export class QuizStateService {
  public readonly genreCategories: GenreCategory[] = [
    {
      name: 'アニメ',
      genres: [
        'アニメ（1990～1999年）',
        'アニメ（2000～2009年）',
        'アニメ（2010年～2019年）',
        'アニメ（2020年～2025年）'
      ]
    },
    {
      name: 'ガンダム',
      genres: [
        '機動戦士ガンダム',
        '機動戦士ガンダム SEED',
        '機動戦士ガンダム 00',
        '機動戦士ガンダム UC',
        '機動戦士ガンダム 鉄血のオルフェンズ',
        '機動戦士ガンダム 閃光のハサウェイ',
        '機動戦士ガンダム 水星の魔女',
        'ガンダム（2000年～2010年）',
        'ガンダム（2011年～2025年） '
      ]
    },
    {
      name: '映画',
      genres: ['日本の映画', '海外の映画', 'ディズニー', '映画全般']
    },
    {
      name: 'エンタメ',
      genres: ['日本のドラマ', '海外のドラマ', '日本の芸能人', '日本のテレビ番組']
    },
    {
      name: '音楽',
      genres: ['JPOP', 'KPOP', '歌詞から曲名当て', 'UverWorld']
    },
    {
      name: '教養',
      genres: ['日本の歴史', '海外の歴史', '日本の地理', '海外の地理']
    },
    {
      name: 'サイエンス',
      genres: ['高校化学', '高校物理']
    },
    {
      name: 'IT スキル',
      genres: [
        'プログラミングの一般知識',
        'Java',
        'Python',
        'C#',
        'SQL',
        'インフラ・サーバー'
      ]
    }
  ];

  public readonly difficulties = ['かんたん', 'ふつう', 'むずかしい'];

  private selectedGenre = signal<string | null>(null);
  private selectedDifficulty = signal<string>('ふつう');
  private selectedGameMode = signal<GameMode>('turn');
  private numberOfQuestions = signal<number>(15); // New: Stores the total number of questions
  private currentQuestionIndex = signal<number>(0);     // New: Tracks the current question number
  private currentQuiz = signal<QuizResponse | null>(null);
  private currentHint = signal<HintResponse | null>(null);

  // Public signals for components to read
  public readonly genre = this.selectedGenre.asReadonly();
  public readonly difficulty = this.selectedDifficulty.asReadonly();
  public readonly gameMode = this.selectedGameMode.asReadonly();
  public readonly totalQuestions = this.numberOfQuestions.asReadonly(); // New: Public accessor
  public readonly questionIndex = this.currentQuestionIndex.asReadonly(); // New: Public accessor
  public readonly quiz = this.currentQuiz.asReadonly();
  public readonly hint = this.currentHint.asReadonly();

  // Computed signal to check if both genre and difficulty are selected
  public readonly isQuizConfigured = computed(() =>
    this.selectedGenre() !== null && this.selectedDifficulty() !== null
  );

  constructor() { }

  setGenre(genre: string): void {
    this.selectedGenre.set(genre);
  }

  setDifficulty(difficulty: string): void {
    this.selectedDifficulty.set(difficulty);
  }

  setGameMode(mode: GameMode): void {
    this.selectedGameMode.set(mode);
  }

  setNumberOfQuestions(count: number): void { // New: Setter for total questions
    this.numberOfQuestions.set(count);
  }

  incrementQuestionIndex(): void { // New: Method to increment question index
    this.currentQuestionIndex.update(value => value + 1);
  }

  setCurrentQuiz(quiz: QuizResponse | null): void {
    this.currentQuiz.set(quiz);
  }

  setCurrentHint(hint: HintResponse | null): void {
    this.currentHint.set(hint);
  }

  // Method to get the current quiz configuration for API requests
  getQuizConfigRequest(): GenerateQuizRequest | null {
    const genre = this.selectedGenre();
    const difficulty = this.selectedDifficulty();
    if (genre && difficulty) {
      return {
        genre,
        difficulty
      };
    }
    return null;
  }

  resetQuizState(): void {
    this.selectedGenre.set(null);
    this.selectedDifficulty.set('ふつう');
    this.selectedGameMode.set('turn');
    this.numberOfQuestions.set(15);   // New: Reset total questions
    this.currentQuestionIndex.set(0);       // New: Reset current question index
    this.currentQuiz.set(null);
    this.currentHint.set(null);
  }
}

