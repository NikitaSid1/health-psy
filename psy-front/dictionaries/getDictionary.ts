// C:\Users\Admin\Desktop\psy\psy-front\dictionaries\getDictionary.ts

// Описываем доступные словари через динамический импорт.
// Мы используем "as any", чтобы TypeScript не ругался на отсутствие 
// новых переводов в других языковых файлах (en.json, ua.json и т.д.) 
// пока мы находимся в процессе рефакторинга.
const dictionaries = {
  ru: () => import('./ru.json').then((module) => module.default as any),
  en: () => import('./en.json').then((module) => module.default as any),
  ua: () => import('./ua.json').then((module) => module.default as any),
  pl: () => import('./pl.json').then((module) => module.default as any),
  de: () => import('./de.json').then((module) => module.default as any),
};

// Типизируем возможные ключи языков
export type Locale = keyof typeof dictionaries;

// Экспортируем саму функцию
export const getDictionary = async (locale: Locale) => {
  // Если передан неизвестный язык, фоллбек на русский
  const loadDictionary = dictionaries[locale] || dictionaries.ru;
  return loadDictionary();
};