"use client";

import { useEffect } from "react";

interface Props {
  translations: Record<string, string>;
  currentLang: string;
}

export default function TranslationProvider({ translations, currentLang }: Props) {
  useEffect(() => {
    // При загрузке страницы отправляем событие с переводами в окно браузера
    const event = new CustomEvent("set-article-translations", { 
      detail: translations 
    });
    window.dispatchEvent(event);

    // Когда пользователь уходит со статьи, стираем эти данные
    return () => {
      window.dispatchEvent(new CustomEvent("set-article-translations", { detail: null }));
    };
  }, [translations, currentLang]);

  return null; // Он не имеет интерфейса, только логика
}