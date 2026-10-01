import { Language, LanguageOption } from '../types';
import { AppTranslationStrings, SUPPORTED_LANGUAGES } from './types';
import { en } from './en';
import { hi } from './hi';
import { kn } from './kn';
import { te } from './te';
import { ta } from './ta';
import { ml } from './ml';
import { mr } from './mr';
import { bn } from './bn';
import { gu } from './gu';
import { pa } from './pa';
import { or } from './or';
import { as } from './as';
import { MULTILINGUAL_CROP_DICTIONARY, getCropDisplayName, getCategoryDisplayName } from './crops';

export { SUPPORTED_LANGUAGES, MULTILINGUAL_CROP_DICTIONARY, getCropDisplayName, getCategoryDisplayName };
export type { AppTranslationStrings };

export const TRANSLATIONS: Record<Language, AppTranslationStrings> = {
  en,
  hi,
  kn,
  te,
  ta,
  ml,
  mr,
  bn,
  gu,
  pa,
  or,
  as
};

const SAVED_LANG_KEY = 'kisanmitra_farmer_preferred_language';

export function getSavedLanguage(): Language {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = window.localStorage.getItem(SAVED_LANG_KEY) as Language;
    if (saved && TRANSLATIONS[saved]) {
      return saved;
    }
  }
  return 'en';
}

export function savePreferredLanguage(lang: Language): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(SAVED_LANG_KEY, lang);
    } catch {
      // ignore
    }
  }
}

/**
 * Returns translation strings with fallback to English if key is missing
 */
export function getTranslations(lang: Language): AppTranslationStrings {
  const chosen = TRANSLATIONS[lang];
  if (!chosen) {
    return TRANSLATIONS.en;
  }
  // Return Proxy to gracefully fall back without undefined errors
  return new Proxy(chosen, {
    get(target, prop: string) {
      if (prop in target && (target as any)[prop] !== undefined && (target as any)[prop] !== '') {
        return (target as any)[prop];
      }
      return (TRANSLATIONS.en as any)[prop] || prop;
    }
  });
}
