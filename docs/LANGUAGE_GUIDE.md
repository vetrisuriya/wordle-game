# Language Guide

Create a new language folder under `src/features/languages/<language>` with these files:

- `dictionary.json` — playable answer words.
- `daily.json` — deterministic daily challenge words.
- `valid.json` — accepted guesses.
- `metadata.json` — code, display names, direction, and virtual-keyboard letters.
- `index.ts` — exports a `LanguagePack` and a Unicode-aware `normalize` function.

Then export the pack from `src/features/languages/index.ts`. This keeps future language support additive and reviewable.
