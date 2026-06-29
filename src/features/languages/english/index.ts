import type { LanguagePack } from '../../../core/types/game';
import daily from './daily.json';
import dictionary from './dictionary.json';
import metadata from './metadata.json';
import valid from './valid.json';

const normalize = (word: string): string =>
  word
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^a-z]/g, '');

export const english: LanguagePack = {
  code: 'english',
  name: metadata.name,
  nativeName: metadata.nativeName,
  direction: 'ltr',
  letters: [...metadata.letters],
  dictionary,
  daily,
  valid: [...new Set([...dictionary, ...daily, ...valid])],
  normalize,
};
