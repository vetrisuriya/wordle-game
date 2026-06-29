import type { Stats } from '../../core/types/game';

export const achievements = [
  ['first-win', 'First Win'],
  ['ten-wins', '10 Wins'],
  ['hundred-wins', '100 Wins'],
  ['streak-7', '7 Day Streak'],
  ['streak-30', '30 Day Streak'],
  ['english-master', 'English Master'],
  ['tamil-master', 'Tamil Master'],
  ['speed-demon', 'Speed Demon'],
] as const;

export const unlocked = (stats: Stats): string[] =>
  achievements
    .filter(([id]) => {
      if (id === 'first-win') return stats.wins >= 1;
      if (id === 'ten-wins') return stats.wins >= 10;
      if (id === 'hundred-wins') return stats.wins >= 100;
      if (id === 'streak-7') return stats.bestStreak >= 7;
      if (id === 'streak-30') return stats.bestStreak >= 30;
      return false;
    })
    .map(([, name]) => name);
