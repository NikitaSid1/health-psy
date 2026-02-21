// C:\Users\Admin\Desktop\psy\psy-front\app\[lang]\post\[slug]\TranslationProvider.tsx
// === НАЧАЛО БЛОКА: Translation Provider (Logic Only) ===
"use client";

import { useEffect } from 'react';

interface Props {
  translations: Record<string, string>; // { en: "slug-en", ru: "slug-ru" }
  currentLang: string;
}

export default function TranslationProvider({ translations, currentLang }: Props) {
  // Отправляем список доступных переводов глобально, чтобы шапка сайта (LanguageSwitcher) 
  // знала правильные ссылки (slug) для перевода текущей статьи
  useEffect(() => {
    const event = new CustomEvent('updateArticleTranslations', { 
      detail: translations 
    });
    window.dispatchEvent(event);

    return () => {
      // Очищаем данные при уходе со статьи
      window.dispatchEvent(new CustomEvent('updateArticleTranslations', { detail: null }));
    };
  }, [translations]);

  // Больше никаких дублирующихся кнопок! 
  return null;
}
// === КОНЕЦ БЛОКА ===