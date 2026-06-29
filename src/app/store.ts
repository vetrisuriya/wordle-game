import { create } from 'zustand';
import { dailyWord, isValidWord, randomWord, scoreGuess } from '../core/utils/gameEngine';
import { save, safeLoad } from '../core/storage/storage';
import type { GameMode, GuessResult, Preferences, Stats } from '../core/types/game';
import { getLanguage } from '../features/languages';

const defaultPrefs: Preferences = {
  language: 'english', theme: 'aurora', sound: false, reducedMotion: false, highContrast: false,
  colorBlind: false, largeText: false, wordLength: 5, mode: 'daily',
};
const defaultStats: Stats = {
  played: 0, wins: 0, losses: 0, currentStreak: 0, bestStreak: 0, guessDistribution: {},
  dailyWins: 0, practiceWins: 0, timePlayed: 0, favoriteLanguage: 'english', favoriteMode: 'daily',
};
interface State {
  prefs: Preferences; stats: Stats; answer: string; guesses: GuessResult[][]; current: string;
  message: string; status: 'playing' | 'won' | 'lost';
  setPref: <K extends keyof Preferences>(k: K, v: Preferences[K]) => void; input: (key: string) => void;
  newGame: (mode?: GameMode) => void; share: () => string;
}
const pick = (p: Preferences) => p.mode === 'daily' ? dailyWord(getLanguage(p.language), p.wordLength) : randomWord(getLanguage(p.language), p.wordLength);
export const useGame = create<State>((set, get) => ({
  prefs: safeLoad('lexora:prefs', defaultPrefs), stats: safeLoad('lexora:stats', defaultStats), answer: '', guesses: [], current: '', message: '', status: 'playing',
  setPref: (k, v) => set((s) => { const prefs = { ...s.prefs, [k]: v }; save('lexora:prefs', prefs); return { prefs, answer: pick(prefs), guesses: [], current: '', status: 'playing', message: '' }; }),
  newGame: (mode) => set((s) => { const prefs = mode ? { ...s.prefs, mode } : s.prefs; save('lexora:prefs', prefs); return { prefs, answer: pick(prefs), guesses: [], current: '', status: 'playing', message: '' }; }),
  share: () => {
    const s = get();
    return `Lexora ${s.prefs.mode} ${s.guesses.length}/6\n` + s.guesses.map((g) => g.map((x) => x.state === 'correct' ? '🟩' : x.state === 'present' ? '🟨' : '⬛').join('')).join('\n');
  },
  input: (key) => set((s) => {
    if (!s.answer) return { answer: pick(s.prefs) };
    if (s.status !== 'playing') return {};
    const pack = getLanguage(s.prefs.language);
    if (key === 'Backspace') return { current: s.current.slice(0, -1) };
    if (key === 'Enter') {
      if ([...pack.normalize(s.current)].length !== s.prefs.wordLength) return { message: 'Not enough letters' };
      if (!isValidWord(pack, s.current, s.prefs.wordLength)) return { message: 'Word not in dictionary' };
      const row = scoreGuess(s.current, s.answer, pack);
      const guesses = [...s.guesses, row];
      const won = row.every((r) => r.state === 'correct');
      const lost = !won && guesses.length >= 6;
      let stats = s.stats;
      if (won || lost) {
        stats = {
          ...s.stats, played: s.stats.played + 1, wins: s.stats.wins + (won ? 1 : 0), losses: s.stats.losses + (lost ? 1 : 0),
          currentStreak: won ? s.stats.currentStreak + 1 : 0, bestStreak: won ? Math.max(s.stats.bestStreak, s.stats.currentStreak + 1) : s.stats.bestStreak,
          guessDistribution: won ? { ...s.stats.guessDistribution, [guesses.length]: (s.stats.guessDistribution[guesses.length] ?? 0) + 1 } : s.stats.guessDistribution,
          dailyWins: s.stats.dailyWins + (won && s.prefs.mode === 'daily' ? 1 : 0), practiceWins: s.stats.practiceWins + (won && s.prefs.mode !== 'daily' ? 1 : 0),
          favoriteLanguage: s.prefs.language, favoriteMode: s.prefs.mode,
        };
        save('lexora:stats', stats);
      }
      return { guesses, current: '', stats, status: won ? 'won' : lost ? 'lost' : 'playing', message: won ? 'Brilliant!' : lost ? `Answer: ${s.answer}` : '' };
    }
    const n = pack.normalize(key);
    if (!n || [...s.current].length >= s.prefs.wordLength) return {};
    return { current: s.current + n, message: '' };
  }),
}));
