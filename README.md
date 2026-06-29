# Lexora

**The Beautiful Daily Word Challenge** — a multilingual, offline-first, open-source word puzzle platform for GitHub Pages.

Lexora is designed as a premium static word-game platform rather than a one-off clone: beautiful UI, deterministic daily puzzles, local-only persistence, PWA installability, and a feature-driven architecture that can grow into more multilingual word games.

## Features

- Premium aurora/glass UI with animated background layers, responsive board, and virtual keyboards.
- English and Tamil language packs with JSON dictionaries and Unicode normalization.
- Daily deterministic puzzles, unlimited practice, and extensible mode settings.
- Zustand state, LocalStorage persistence, PWA service worker, SEO files, and GitHub Pages CI.
- Statistics, achievements, share results, accessibility toggles, themes, and reduced-motion support.

## Development

```bash
npm install
npm run dev
npm test
npm run build
```

## Architecture

Feature-driven modules live in `src/features`; reusable engine, storage, and types live in `src/core`; app composition lives in `src/app`. Language folders contain `dictionary.json`, `daily.json`, `valid.json`, `metadata.json`, and a small `index.ts` adapter.
