// C:\Users\Admin\Desktop\psy\psy-front\components\ui\Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle"; 
import LanguageSwitcher from "../LanguageSwitcher";
import DesktopMenu from "./DesktopMenu";
import SearchClient from "@/components/search/SearchClient";

export default function Header() {
  const pathname = usePathname();
  const langMatch = pathname?.split("/")[1];
  const lang = ['ru', 'en', 'ua', 'pl', 'de'].includes(langMatch || "") ? langMatch as string : "ru";

  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    import(`@/dictionaries/${lang}.json`)
      .then((m) => setDict(m.default.header))
      .catch(() => import(`@/dictionaries/ru.json`).then((m) => setDict(m.default.header)));
  }, [lang]);

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener("open-search", handleOpenSearch);
    return () => window.removeEventListener("open-search", handleOpenSearch);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-gray-200 dark:border-zinc-800 transition-colors duration-500 ease-in-out">
        <div className="layout-container flex items-center justify-between w-full h-16 md:h-20 px-4 md:px-8">
          
          <div className="flex items-center gap-4">
            <button onClick={() => setIsDesktopMenuOpen(true)} className="hidden md:flex p-2 -ml-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors active:scale-95">
              <MenuIcon size={24} strokeWidth={2.5} />
            </button>
            <Link href={`/${lang}`} className="text-xl md:text-2xl font-extrabold tracking-tight text-[#111827] dark:text-white transition-opacity hover:opacity-80">
              HEALTH<span className="text-blue-600 font-normal">PSY</span>
            </Link>
          </div>

          <nav className="flex items-center gap-2 md:gap-6">
            <Link href={`/${lang}/bookmarks`} className="hidden md:block text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
              {dict?.bookmarks || "..."}
            </Link>
            
            <div className="flex items-center gap-2 md:gap-4 md:border-l border-gray-300 dark:border-zinc-700 md:pl-6">
              <button 
                onClick={() => setIsSearchOpen(true)} 
                className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors active:scale-95"
                aria-label={dict?.search || "Search"}
              >
                <Search size={20} strokeWidth={2.5} />
              </button>
              <LanguageSwitcher />
              <div className="hidden md:block"><ThemeToggle /></div>
            </div>
          </nav>
        </div>
      </header>

      <DesktopMenu isOpen={isDesktopMenuOpen} onClose={() => setIsDesktopMenuOpen(false)} lang={lang} />
      <SearchClient lang={lang} isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}