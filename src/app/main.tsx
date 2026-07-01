import React, { useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings, Share2, Sparkles, Volume2 } from 'lucide-react';
import { useGame } from './store';
import { getLanguage, languages } from '../features/languages';
import { themes } from '../features/themes/themes';
import { unlocked } from '../features/achievements/achievements';
import '../styles/global.css';

function Board() {
  const { prefs, guesses, current } = useGame();
  const rows = Array.from({ length: 6 }, (_, rowIndex) => {
    return (
      guesses[rowIndex] ??
      Array.from({ length: prefs.wordLength }, (_, columnIndex) => ({
        letter: rowIndex === guesses.length ? [...current][columnIndex] ?? '' : '',
        state: 'empty' as const,
      }))
    );
  });

  return (
    <section className="board" aria-label="Game board">
      {rows.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((cell, columnIndex) => (
            <motion.div
              aria-label={`${cell.letter || 'empty'} ${cell.state}`}
              className={`tile ${cell.state}`}
              key={columnIndex}
              initial={{ rotateX: 0, scale: 0.96 }}
              animate={{ rotateX: cell.state !== 'empty' ? 360 : 0, scale: cell.letter ? 1 : 0.96 }}
              transition={{ delay: columnIndex * 0.06, type: 'spring' }}
            >
              {cell.letter}
            </motion.div>
          ))}
        </div>
      ))}
    </section>
  );
}

function Keyboard() {
  const { prefs, input } = useGame();
  const letters = getLanguage(prefs.language).letters;

  return (
    <div className="keyboard" aria-label="Virtual keyboard">
      {letters.map((letter) => (
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => input(letter)} key={letter}>
          {letter}
        </motion.button>
      ))}
      <button onClick={() => input('Backspace')}>⌫</button>
      <button className="wide" onClick={() => input('Enter')}>
        Enter
      </button>
    </div>
  );
}

function App() {
  const { prefs, setPref, newGame, input, status, message, stats, share } = useGame();

  const copyShare = useCallback(async () => {
    const text = share();
    try {
      await navigator.clipboard.writeText(text);
      window.alert('Result copied to clipboard!');
    } catch {
      window.prompt('Copy your Lexora result', text);
    }
  }, [share]);

  useEffect(() => {
    newGame();
    const handler = (event: KeyboardEvent) => input(event.key);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [input, newGame]);

  const achievements = unlocked(stats);

  return (
    <main
      className={`app theme-${prefs.theme} ${prefs.highContrast ? 'contrast' : ''} ${
        prefs.largeText ? 'large' : ''
      }`}
    >
      <div className="bg" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <p className="eyebrow">
            <Sparkles size={16} /> The Beautiful Daily Word Challenge
          </p>
          <h1>Lexora</h1>
        </div>
        <button onClick={copyShare} aria-label="Copy share result">
          <Share2 />
        </button>
      </motion.header>

      <section className="hero">
        <div className="panel game">
          <div className="toolbar">
            <select value={prefs.language} onChange={(event) => setPref('language', event.target.value as never)}>
              {languages.map((language) => (
                <option value={language.code} key={language.code}>
                  {language.nativeName}
                </option>
              ))}
            </select>
            <select value={prefs.mode} onChange={(event) => setPref('mode', event.target.value as never)}>
              {['daily', 'practice', 'zen', 'speed', 'kids', 'learning', 'timed'].map((mode) => (
                <option key={mode}>{mode}</option>
              ))}
            </select>
            <select
              value={prefs.wordLength}
              onChange={(event) => setPref('wordLength', Number(event.target.value) as never)}
            >
              <option>4</option>
              <option>5</option>
              <option>6</option>
            </select>
            <button onClick={() => setPref('sound', !prefs.sound)} aria-label="Toggle sound">
              <Volume2 size={16} />
            </button>
          </div>

          <Board />
          <AnimatePresence>
            {message && (
              <motion.p
                className="toast"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
          <Keyboard />
          <button className="primary" onClick={() => newGame(prefs.mode)}>
            {status === 'playing' ? 'Restart' : 'New puzzle'}
          </button>
        </div>

        <aside className="panel">
          <h2>
            <Settings /> Command Center
          </h2>
          <label className="field">
            <span>Theme</span>
            <select value={prefs.theme} onChange={(event) => setPref('theme', event.target.value)}>
              {themes.map((theme) => (
                <option key={theme}>{theme}</option>
              ))}
            </select>
          </label>
          <div className="toggles">
            {(['reducedMotion', 'highContrast', 'colorBlind', 'largeText'] as const).map((key) => (
              <label className="toggle" key={key}>
                <input
                  type="checkbox"
                  checked={Boolean(prefs[key])}
                  onChange={(event) => setPref(key, event.target.checked)}
                />
                {key}
              </label>
            ))}
          </div>
          <h3>Statistics</h3>
          <div className="stats">
            {[
              ['Played', stats.played],
              ['Wins', stats.wins],
              ['Streak', stats.currentStreak],
              ['Best', stats.bestStreak],
            ].map(([label, value]) => (
              <b key={label}>
                <span>{value}</span>
                {label}
              </b>
            ))}
          </div>
          <h3>Achievements</h3>
          <p>{achievements.length ? achievements.join(', ') : 'Win your first puzzle to unlock badges.'}</p>
        </aside>
      </section>

      <footer>Designed with love by <a href="https://vetrisuriya.in/" target="_blank" rel="noreferrer">Vetri Suriya</a>.</footer>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
