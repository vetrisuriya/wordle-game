# Lexora

**The Beautiful Daily Word Challenge** — a multilingual, offline-first, open-source word puzzle platform that runs entirely as static files.

Lexora is a Wordle-inspired platform, not a clone. The goal is to combine a premium aurora/glass interface with a reusable multilingual game engine so the project can grow into a broader word-games suite over time.

## What is included

- **Static-first app**: Vite, React, TypeScript, and GitHub Pages-friendly relative asset paths.
- **Offline/PWA support**: `vite-plugin-pwa`, Web App Manifest metadata, SVG app icon, and Workbox asset caching.
- **Game engine**: deterministic UTC daily puzzle selection, practice-word selection, validation, and duplicate-aware guess scoring.
- **Initial languages**: English and Tamil packs with `dictionary.json`, `daily.json`, `valid.json`, `metadata.json`, and Unicode normalization adapters.
- **Local-only state**: Zustand for app state and LocalStorage helpers for preferences and statistics.
- **Premium UI direction**: aurora gradients, glass panels, animated board/keyboard interactions, theme hooks, and responsive layout.
- **Accessibility foundations**: semantic labels, keyboard input, reduced-motion CSS, contrast/large-text toggles, and color-aware tile states.
- **Open-source setup**: MIT license, contribution docs, security policy, code of conduct, architecture notes, language guide, theme guide, and CI.

## Project structure

```txt
src/
  app/                 App entry and global game store
  core/                Reusable engine, storage, utility, and type modules
  features/
    achievements/      Achievement definitions and unlock logic
    languages/         Drop-in language packs
    themes/            Theme registry
  styles/              Global visual system
  tests/               Vitest unit tests
public/                Static PWA and SEO assets
docs/                  Architecture, deployment, language, and theme guides
```

## Development

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
```

## Adding a language

Create `src/features/languages/<language>/` with:

- `dictionary.json` for possible answer words.
- `daily.json` for deterministic daily challenge words.
- `valid.json` for accepted guesses.
- `metadata.json` for display names and keyboard letters.
- `index.ts` that exports a `LanguagePack` and normalization function.

Then export the pack from `src/features/languages/index.ts`.

## Deployment

The workflow in `.github/workflows/deploy.yml` always runs install, lint, tests, and build on pushes and pull requests.

GitHub Pages deployment is intentionally gated by the repository variable `ENABLE_PAGES_DEPLOY=true`. This prevents fresh forks or repositories without Pages enabled from failing with the GitHub API `404 Not Found` error returned by `actions/deploy-pages`.

To enable deployment:

1. Open **Settings → Pages** for the repository.
2. Set the source to **GitHub Actions**.
3. Add a repository variable named `ENABLE_PAGES_DEPLOY` with value `true`.
4. Push to `main`.

## Privacy

Lexora has no login, backend, ads, or tracking. Player preferences, history, and statistics are stored locally in the browser.

## License

MIT — see [`LICENSE`](./LICENSE).
