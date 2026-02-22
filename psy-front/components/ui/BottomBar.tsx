// C:\Users\Admin\Desktop\psy\psy-front\components\ui\BottomBar.tsx
// === НАЧАЛО БЛОКА: Bottom Navigation Bar ===
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bookmark, Menu } from "lucide-react";

// Изолированный словарь для переводов нижнего меню
const bottomNavTranslations = {
  ru: { home: "Главная", search: "Поиск", bookmarks: "Закладки", menu: "Меню" },
  en: { home: "Home", search: "Search", bookmarks: "Bookmarks", menu: "Menu" },
  ua: { home: "Головна", search: "Пошук", bookmarks: "Закладки", menu: "Меню" },
  pl: { home: "Główna", search: "Szukaj", bookmarks: "Zakładki", menu: "Menu" },
  de: { home: "Start", search: "Suche", bookmarks: "Lesezeichen", menu: "Menü" },
};

export default function BottomBar() {
  const pathname = usePathname();
  // Вытаскиваем текущий язык из URL (например, "ru" из "/ru/bookmarks")
  const lang = pathname.split('/')[1] || 'en';
  const t = bottomNavTranslations[lang as keyof typeof bottomNavTranslations] || bottomNavTranslations.en;

  const navItems = [
    { id: "nav-home", href: `/${lang}`, icon: Home, label: t.home },
    { id: "nav-search", href: `/${lang}/search`, icon: Search, label: t.search },
    { id: "nav-bookmarks", href: `/${lang}/bookmarks`, icon: Bookmark, label: t.bookmarks },
    { id: "nav-menu", href: `/${lang}/menu`, icon: Menu, label: t.menu },
  ];

  return (
    <nav 
      id="bottom-bar" 
      // md:hidden скрывает бар на ПК. Класс с safe-area-inset-bottom дает правильный отступ на iPhone.
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-gray-200 dark:border-zinc-800 transition-colors duration-500 ease-in-out pb-[env(safe-area-inset-bottom)]"
    >
      <div id="bottom-bar-container" className="flex items-center justify-around h-[64px] px-2">
        {navItems.map((item) => {
          // Проверяем, активна ли текущая вкладка (для подсветки)
          const isActive = pathname === item.href || (item.href !== `/${lang}` && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              id={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors duration-300 ${
                isActive 
                  ? "text-blue-600 dark:text-blue-500" 
                  : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              <Icon 
                id={`${item.id}-icon`} 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2} 
                className="transition-transform duration-300 active:scale-95" 
              />
              <span id={`${item.id}-label`} className="text-[10px] font-semibold tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
// === КОНЕЦ БЛОКА ===