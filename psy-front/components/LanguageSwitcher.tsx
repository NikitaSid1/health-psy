"use client"; // Это клиентский компонент, так как в нем есть onClick

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// === НАЧАЛО БЛОКА: КОМПОНЕНТ ПЕРЕКЛЮЧАТЕЛЯ ЯЗЫКОВ ===
export default function LanguageSwitcher() {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState("ru");
  
  // 1. Состояние для отслеживания загрузки на клиенте
  const [mounted, setMounted] = useState(false);

  const languages = [
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
    { code: "ua", label: "UA" },
    { code: "pl", label: "PL" },
    { code: "de", label: "DE" },
  ];

  useEffect(() => {
    // Читаем куки при первой загрузке страницы, чтобы подсветить активный язык
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    if (match) setCurrentLang(match[2]);
    
    // 2. Сигнализируем, что куки прочитаны и можно безопасно рендерить UI
    setMounted(true);
  }, []);

  const switchLanguage = (lang: string) => {
    // Сохраняем выбор пользователя в куки на 1 год
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
    setCurrentLang(lang);
    // Даем команду Next.js перерендерить серверные компоненты с новыми данными
    router.refresh();
  };

  // 3. Защита от прыжка интерфейса (Hydration Mismatch)
  if (!mounted) return null;

  return (
    // Добавили "hidden md:flex" в самое начало классов
    <div id="language-switcher-wrapper" className="hidden md:flex fixed top-4 right-4 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm border border-gray-100 dark:border-gray-700 rounded-full p-1 items-center gap-1 transition-colors duration-300">
      {languages.map((lang) => (
        <button
          key={lang.code}
          id={`lang-btn-${lang.code}`}
          onClick={() => switchLanguage(lang.code)}
          className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
            currentLang === lang.code
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
// === КОНЕЦ БЛОКА ===