# Architecture

Lexora uses Feature Driven Architecture. The game engine is isolated in `src/core/utils/gameEngine.ts` so future games can reuse deterministic daily selection, validation, and scoring concepts. Language packs expose metadata, keyboard letters, dictionaries, and normalization.
