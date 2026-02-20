// C:\Users\Admin\Desktop\psy\psy-front\components\ui\Header.tsx
// === НАЧАЛО БЛОКА: Header ===
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle"; 
import LanguageSwitcher from "../LanguageSwitcher";

const translations = {
  ru: { bookmarks: "Закладки" },
  en: { bookmarks: "Bookmarks" },
  ua: { bookmarks: "Закладки" },
  pl: { bookmarks: "Zakładki" },
  de: { bookmarks: "Lesezeichen" },
};

export default function Header() {
  const pathname = usePathname();
  const lang = (pathname?.split("/")[1] || "ru") as keyof typeof translations;
  // Добавлена защита от падения, если язык в URL некорректный
  const t = translations[lang as keyof typeof translations] || translations.ru;

  return (
    <header 
      id="main-header" 
      // УБРАНО: hidden md:flex. Теперь шапка всегда на месте, но адаптируется.
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-gray-200 dark:border-zinc-800 transition-colors duration-500 ease-in-out"
    >
      <div id="header-container" className="layout-container flex items-center justify-between w-full h-16 md:h-20 px-4 md:px-8">
        
        {/* ЛЕВАЯ ЧАСТЬ: Меню категорий (только ПК) и Логотип (ПК + Мобайл) */}
        <div id="header-left" className="flex items-center gap-4">
          <button 
            id="header-burger-btn" 
            className="hidden md:flex p-2 -ml-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors active:scale-95"
            aria-label="Open menu"
          >
            <MenuIcon size={24} strokeWidth={2.5} />
          </button>
          
          <Link id="header-logo" href={`/${lang}`} className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white transition-opacity hover:opacity-80">
            HEALTH<span className="text-blue-600 font-normal">PSY</span>
          </Link>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: Закладки, Язык и Тема (СКРЫТО НА ТЕЛЕФОНЕ ПО ТЗ) */}
        <nav id="header-right" className="hidden md:flex items-center gap-6 text-sm font-bold text-gray-600 dark:text-gray-300">
          <Link id="header-bookmarks" href={`/${lang}/bookmarks`} className="hover:text-blue-600 transition-colors">
            {t.bookmarks}
          </Link>
          
          <div id="header-controls" className="border-l border-gray-300 dark:border-zinc-700 pl-6 flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </nav>
        
      </div>
    </header>
  );
}
// === КОНЕЦ БЛОКА ===