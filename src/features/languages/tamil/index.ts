import type { LanguagePack } from '../../../core/types/game';
import daily from './daily.json';
import dictionary from './dictionary.json';
import metadata from './metadata.json';
import valid from './valid.json';

const normalize = (word: string): string =>
  word.normalize('NFC').replace(/[\u200B-\u200D\uFEFF\s]/g, '');

export const tamil: LanguagePack = {
  code: 'tamil',
  name: metadata.name,
  nativeName: metadata.nativeName,
  direction: 'ltr',
  letters: metadata.letters,
  dictionary,
  daily,
  valid: [...new Set([...dictionary, ...daily, ...valid])],
  normalize,
};
