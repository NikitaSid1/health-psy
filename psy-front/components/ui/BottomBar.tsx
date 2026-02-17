"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { triggerHaptic } from "@/lib/haptic";

const translations = {
  ru: { home: "Главная", fav: "Избранное", menu: "Меню" },
  en: { home: "Home", fav: "Bookmarks", menu: "Menu" },
  ua: { home: "Головна", fav: "Обране", menu: "Меню" },
  pl: { home: "Główna", fav: "Zakładki", menu: "Menu" },
  de: { home: "Home", fav: "Favoriten", menu: "Menü" },
};

export default function BottomBar() {
  const pathname = usePathname();
  const currentLang = (pathname?.split("/")[1] || "ru") as keyof typeof translations;
  const t = translations[currentLang] || translations.ru;

  const isActive = (path: string) => {
    if (path === `/${currentLang}`) {
      return pathname === `/${currentLang}` || pathname === `/${currentLang}/`;
    }
    return pathname?.startsWith(path);
  };

  return (
    <nav id="mobile-bottom-bar" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-lg border-t border-gray-100 dark:border-zinc-800 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-4">
        
        <Link 
          href={`/${currentLang}`} 
          onClick={() => triggerHaptic('light')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive(`/${currentLang}`) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-bold">{t.home}</span>
        </Link>

        <Link 
          href={`/${currentLang}/bookmarks`} 
          onClick={() => triggerHaptic('light')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive(`/${currentLang}/bookmarks`) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span className="text-[10px] font-bold">{t.fav}</span>
        </Link>

        <Link 
          href={`/${currentLang}/menu`} 
          onClick={() => triggerHaptic('light')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive(`/${currentLang}/menu`) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-[10px] font-bold">{t.menu}</span>
        </Link>

      </div>
    </nav>
  );
}