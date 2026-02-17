"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle"; 
import LanguageSwitcher from "../LanguageSwitcher";

const translations = {
  ru: { search: "Поиск", bookmarks: "Закладки" },
  en: { search: "Search", bookmarks: "Bookmarks" },
  ua: { search: "Пошук", bookmarks: "Закладки" },
  pl: { search: "Szukaj", bookmarks: "Zakładki" },
  de: { search: "Suche", bookmarks: "Lesezeichen" },
};

export default function Header() {
  const pathname = usePathname();
  const lang = (pathname?.split("/")[1] || "ru") as keyof typeof translations;
  const t = translations[lang] || translations.ru;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 hidden md:flex items-center h-16">
      <div className="layout-container flex items-center justify-between w-full">
        
        <Link href={`/${lang}`} className="text-xl font-black tracking-tighter text-foreground">
          HEALTH<span className="text-blue-600 font-normal">PSY</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-bold text-gray-600 dark:text-gray-300">
          <Link href={`/${lang}/search`} className="hover:text-blue-600 transition-colors">
            {t.search}
          </Link>
          <Link href={`/${lang}/bookmarks`} className="hover:text-blue-600 transition-colors">
            {t.bookmarks}
          </Link>
          
          <div className="border-l border-gray-300 dark:border-zinc-700 pl-6 flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </nav>
        
      </div>
    </header>
  );
}