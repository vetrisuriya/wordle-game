import type { LanguageCode, LanguagePack } from '../../core/types/game';
import { english } from './english';
import { tamil } from './tamil';

const packs: Record<LanguageCode, LanguagePack> = { english, tamil };

export const languages = Object.values(packs);
export const getLanguage = (code: LanguageCode): LanguagePack => packs[code] ?? english;
