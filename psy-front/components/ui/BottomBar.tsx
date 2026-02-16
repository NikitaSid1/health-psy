"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// === НАЧАЛО БЛОКА: Bottom Bar ===
export default function BottomBar() {
  const pathname = usePathname();

  // Функция для проверки активной ссылки
  const isActive = (path: string) => pathname === path;

  // Функция для тактильного отклика (Haptic)
  const triggerHaptic = () => {
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  return (
    // md:hidden скрывает меню на ПК, backdrop-blur делает красивое размытие фона (как в iOS)
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-lg border-t border-gray-100 dark:border-zinc-800 pb-safe">
      <div className="flex items-center justify-around h-16 px-4">
        
        {/* Главная */}
        <Link 
          href="/" 
          onClick={triggerHaptic}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/') ? 2.5 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-bold">Главная</span>
        </Link>

        {/* Избранное */}
        <Link 
          href="/bookmarks" 
          onClick={triggerHaptic}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/bookmarks') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/bookmarks') ? 2.5 : 2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span className="text-[10px] font-bold">Избранное</span>
        </Link>

        {/* Меню */}
        <Link 
          href="/menu" 
          onClick={triggerHaptic}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/menu') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/menu') ? 2.5 : 2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-[10px] font-bold">Меню</span>
        </Link>

      </div>
    </nav>
  );
}
// === КОНЕЦ БЛОКА ===