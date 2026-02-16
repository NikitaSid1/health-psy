"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// === НАЧАЛО БЛОКА: МОБИЛЬНОЕ НИЖНЕЕ МЕНЮ (BOTTOM BAR) ===
export default function BottomBar() {
  // usePathname помогает нам узнать, на какой странице мы находимся, чтобы подсветить активную иконку
  const pathname = usePathname();

  // Структура нашего меню (Пункт 5 ТЗ)
  const navItems = [
    {
      id: "nav-home",
      label: "Главная",
      href: "/",
      // SVG иконка домика
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: "nav-search",
      label: "Поиск",
      href: "/search",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: "nav-bookmarks",
      label: "Закладки",
      href: "/bookmarks",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
    },
    {
      id: "nav-menu",
      label: "Меню",
      href: "/menu",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
    },
  ];

  return (
    // Класс md:hidden скрывает панель на планшетах и ПК
    // pb-safe (safe-area-inset-bottom) нужен для айфонов с "челочкой" внизу экрана
    <nav
      id="mobile-bottom-bar"
      className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 transition-colors duration-500 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              id={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
// === КОНЕЦ БЛОКА ===