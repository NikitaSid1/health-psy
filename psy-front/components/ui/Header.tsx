// C:\Users\Admin\Desktop\psy\psy-front\components\ui\Header.tsx
// === НАЧАЛО БЛОКА: Header ===
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle"; 
import LanguageSwitcher from "../LanguageSwitcher";
import DesktopMenu from "./DesktopMenu";

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
  const t = translations[lang as keyof typeof translations] || translations.ru;

  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  return (
    <>
      <header 
        id="main-header" 
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-gray-200 dark:border-zinc-800 transition-colors duration-500 ease-in-out"
      >
        <div id="header-container" className="layout-container flex items-center justify-between w-full h-16 md:h-20 px-4 md:px-8">
          
          {/* ЛЕВАЯ ЧАСТЬ */}
          <div id="header-left" className="flex items-center gap-4">
            <button 
              id="header-burger-btn" 
              onClick={() => setIsDesktopMenuOpen(true)}
              className="hidden md:flex p-2 -ml-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors active:scale-95"
              aria-label="Open categories menu"
              aria-expanded={isDesktopMenuOpen}
            >
              <MenuIcon size={24} strokeWidth={2.5} />
            </button>
            
            <Link id="header-logo" href={`/${lang}`} className="text-xl md:text-2xl font-extrabold tracking-tight text-[#111827] dark:text-white transition-opacity hover:opacity-80">
              HEALTH<span className="text-blue-600 font-normal">PSY</span>
            </Link>
          </div>

          {/* ПРАВАЯ ЧАСТЬ */}
          <nav id="header-right" className="flex items-center gap-2 md:gap-6">
            <Link id="header-bookmarks" href={`/${lang}/bookmarks`} className="hidden md:block text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
              {t.bookmarks}
            </Link>
            
            <div id="header-controls" className="flex items-center gap-2 md:gap-4 md:border-l border-gray-300 dark:border-zinc-700 md:pl-6">
              {/* Dropdown Языка теперь доступен и на ПК, и на Мобилках */}
              <LanguageSwitcher />
              
              {/* Темную тему прячем на мобилке, она есть в Mobile Menu */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
            </div>
          </nav>
          
        </div>
      </header>

      <DesktopMenu 
        isOpen={isDesktopMenuOpen} 
        onClose={() => setIsDesktopMenuOpen(false)} 
        lang={lang} 
      />
    </>
  );
}
// === КОНЕЦ БЛОКА ===