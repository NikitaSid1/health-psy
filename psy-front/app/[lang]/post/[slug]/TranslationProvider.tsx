// === НАЧАЛО БЛОКА: Translation Provider (UI Buttons) ===
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  translations: Record<string, string>; // { en: "slug-en", ru: "slug-ru" }
  currentLang: string;
}

export default function TranslationProvider({ translations, currentLang }: Props) {
  const router = useRouter();

  // Отправляем список доступных переводов глобально, чтобы шапка сайта (LanguageSwitcher) 
  // знала правильные ссылки (slug) для перевода текущей статьи
  useEffect(() => {
    const event = new CustomEvent('updateArticleTranslations', { 
      detail: translations 
    });
    window.dispatchEvent(event);

    return () => {
      // Очищаем при уходе со статьи
      window.dispatchEvent(new CustomEvent('updateArticleTranslations', { detail: null }));
    };
  }, [translations]);

  // Список всех поддерживаемых языков в проекте
  const languages = [
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
    { code: 'ua', label: 'UA' },
    { code: 'pl', label: 'PL' },
    { code: 'de', label: 'DE' }
  ];

  // Фильтруем:
  // 1. Проверяем, есть ли перевод для этого языка (translations[code]).
  // 2. Исключаем текущий язык (currentLang), чтобы не показывать кнопку языка, на котором мы уже находимся.
  const availableTranslations = languages.filter(
    lang => translations[lang.code] && lang.code !== currentLang
  );

  // Если других переводов нет, компонент ничего не рисует
  if (availableTranslations.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {availableTranslations.map((lang) => (
        <button
          key={lang.code}
          // При клике переходим на страницу перевода
          onClick={() => router.push(`/${lang.code}/post/${translations[lang.code]}`)}
          className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white p-3 rounded-full shadow-lg border border-gray-200 dark:border-zinc-700 hover:scale-110 transition-transform flex items-center justify-center font-bold text-xs w-12 h-12"
          aria-label={`Switch to ${lang.label}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
// === КОНЕЦ БЛОКА ===