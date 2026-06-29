import { create } from 'zustand';
import { dailyWord, isValidWord, randomWord, scoreGuess } from '../core/utils/gameEngine';
import { save, safeLoad } from '../core/storage/storage';
import type { GameMode, GuessResult, Preferences, Stats } from '../core/types/game';
import { getLanguage } from '../features/languages';

const defaultPrefs: Preferences = {
  language: 'english',
  theme: 'aurora',
  sound: false,
  reducedMotion: false,
  highContrast: false,
  colorBlind: false,
  largeText: false,
  wordLength: 5,
  mode: 'daily',
};

const defaultStats: Stats = {
  played: 0,
  wins: 0,
  losses: 0,
  currentStreak: 0,
  bestStreak: 0,
  guessDistribution: {},
  dailyWins: 0,
  practiceWins: 0,
  timePlayed: 0,
  favoriteLanguage: 'english',
  favoriteMode: 'daily',
};

interface State {
  prefs: Preferences;
  stats: Stats;
  answer: string;
  guesses: GuessResult[][];
  current: string;
  message: string;
  status: 'playing' | 'won' | 'lost';
  setPref: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  input: (key: string) => void;
  newGame: (mode?: GameMode) => void;
  share: () => string;
}

const pickAnswer = (prefs: Preferences): string => {
  const pack = getLanguage(prefs.language);
  return prefs.mode === 'daily'
    ? dailyWord(pack, prefs.wordLength)
    : randomWord(pack, prefs.wordLength);
};

const createGame = (prefs: Preferences) => ({
  prefs,
  answer: pickAnswer(prefs),
  guesses: [],
  current: '',
  status: 'playing' as const,
  message: '',
});

const initialPrefs = safeLoad('lexora:prefs', defaultPrefs);

export const useGame = create<State>((set, get) => ({
  ...createGame(initialPrefs),
  stats: safeLoad('lexora:stats', defaultStats),

  setPref: (key, value) =>
    set((state) => {
      const prefs = { ...state.prefs, [key]: value };
      save('lexora:prefs', prefs);
      return createGame(prefs);
    }),

  newGame: (mode) =>
    set((state) => {
      const prefs = mode ? { ...state.prefs, mode } : state.prefs;
      save('lexora:prefs', prefs);
      return createGame(prefs);
    }),

  share: () => {
    const state = get();
    const rows = state.guesses
      .map((guess) =>
        guess
          .map((cell) => (cell.state === 'correct' ? '🟩' : cell.state === 'present' ? '🟨' : '⬛'))
          .join(''),
      )
      .join('\n');
    return `Lexora ${state.prefs.mode} ${state.status === 'won' ? state.guesses.length : 'X'}/6\n${rows}\nhttps://vetrisuriya.in/`;
  },

  input: (key) =>
    set((state) => {
      if (state.status !== 'playing') return {};

      const pack = getLanguage(state.prefs.language);
      const normalizedKey = pack.normalize(key);
      const currentLength = [...pack.normalize(state.current)].length;

      if (key === 'Backspace') {
        return { current: [...state.current].slice(0, -1).join(''), message: '' };
      }

      if (key === 'Enter') {
        if (currentLength !== state.prefs.wordLength) return { message: 'Not enough letters' };
        if (!isValidWord(pack, state.current, state.prefs.wordLength)) {
          return { message: 'Word not in dictionary' };
        }

        const row = scoreGuess(state.current, state.answer, pack);
        const guesses = [...state.guesses, row];
        const won = row.every((cell) => cell.state === 'correct');
        const lost = !won && guesses.length >= 6;
        let stats = state.stats;

        if (won || lost) {
          stats = {
            ...state.stats,
            played: state.stats.played + 1,
            wins: state.stats.wins + (won ? 1 : 0),
            losses: state.stats.losses + (lost ? 1 : 0),
            currentStreak: won ? state.stats.currentStreak + 1 : 0,
            bestStreak: won
              ? Math.max(state.stats.bestStreak, state.stats.currentStreak + 1)
              : state.stats.bestStreak,
            guessDistribution: won
              ? {
                  ...state.stats.guessDistribution,
                  [guesses.length]: (state.stats.guessDistribution[guesses.length] ?? 0) + 1,
                }
              : state.stats.guessDistribution,
            dailyWins: state.stats.dailyWins + (won && state.prefs.mode === 'daily' ? 1 : 0),
            practiceWins: state.stats.practiceWins + (won && state.prefs.mode !== 'daily' ? 1 : 0),
            favoriteLanguage: state.prefs.language,
            favoriteMode: state.prefs.mode,
          };
          save('lexora:stats', stats);
        }

        return {
          guesses,
          current: '',
          stats,
          status: won ? 'won' : lost ? 'lost' : 'playing',
          message: won ? 'Brilliant!' : lost ? `Answer: ${state.answer}` : '',
        };
      }

      if (!normalizedKey || [...normalizedKey].length !== 1 || currentLength >= state.prefs.wordLength) {
        return {};
      }

      return { current: state.current + normalizedKey, message: '' };
    }),
}));
