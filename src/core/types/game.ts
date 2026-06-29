export type LanguageCode = 'english' | 'tamil';

export type GameMode =
  | 'daily'
  | 'practice'
  | 'zen'
  | 'speed'
  | 'kids'
  | 'learning'
  | 'timed';

export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export interface LanguagePack {
  code: LanguageCode;
  name: string;
  nativeName: string;
  direction: 'ltr';
  letters: string[];
  dictionary: string[];
  daily: string[];
  valid: string[];
  normalize: (word: string) => string;
}

export interface GuessResult {
  letter: string;
  state: LetterState;
}

export interface Stats {
  played: number;
  wins: number;
  losses: number;
  currentStreak: number;
  bestStreak: number;
  guessDistribution: Record<number, number>;
  dailyWins: number;
  practiceWins: number;
  timePlayed: number;
  favoriteLanguage: LanguageCode;
  favoriteMode: GameMode;
}

export interface Preferences {
  language: LanguageCode;
  theme: string;
  sound: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  colorBlind: boolean;
  largeText: boolean;
  wordLength: 4 | 5 | 6;
  mode: GameMode;
}
