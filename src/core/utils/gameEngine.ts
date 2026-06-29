import type { GuessResult, LanguagePack } from '../types/game';

const epoch = Date.UTC(2024, 0, 1);
const millisecondsPerDay = 86_400_000;

export const dayIndex = (date = new Date()): number => {
  const utcMidnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((utcMidnight - epoch) / millisecondsPerDay);
};

const wordsByLength = (words: string[], pack: LanguagePack, length: number): string[] =>
  words.filter((word) => [...pack.normalize(word)].length === length);

export const dailyWord = (pack: LanguagePack, length: number, date = new Date()): string => {
  const candidates = wordsByLength(pack.daily, pack, length);
  const fallback = candidates.length > 0 ? candidates : pack.daily;
  return fallback[Math.abs(dayIndex(date)) % fallback.length] ?? pack.daily[0];
};

export const randomWord = (pack: LanguagePack, length: number): string => {
  const candidates = wordsByLength(pack.dictionary, pack, length);
  const fallback = candidates.length > 0 ? candidates : pack.dictionary;
  return fallback[Math.floor(Math.random() * fallback.length)] ?? pack.dictionary[0];
};

export const isValidWord = (pack: LanguagePack, guess: string, length: number): boolean => {
  const normalizedGuess = pack.normalize(guess);
  const validWords = new Set(pack.valid.map((word) => pack.normalize(word)));
  return [...normalizedGuess].length === length && validWords.has(normalizedGuess);
};

export const scoreGuess = (
  guessRaw: string,
  answerRaw: string,
  pack: LanguagePack,
): GuessResult[] => {
  const guess = [...pack.normalize(guessRaw)];
  const answer = [...pack.normalize(answerRaw)];
  const used = Array(answer.length).fill(false);

  const result = guess.map<GuessResult>((letter, index) => {
    const isCorrect = letter === answer[index];
    if (isCorrect) used[index] = true;
    return { letter, state: isCorrect ? 'correct' : 'empty' };
  });

  result.forEach((cell) => {
    if (cell.state === 'correct') return;
    const hitIndex = answer.findIndex((letter, index) => !used[index] && letter === cell.letter);
    if (hitIndex >= 0) {
      used[hitIndex] = true;
      cell.state = 'present';
    } else {
      cell.state = 'absent';
    }
  });

  return result;
};
