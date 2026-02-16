import Link from "next/link";
// Если у тебя кнопка смены темы называется иначе или лежит в другом месте, поправь импорт:
import { ThemeToggle } from "./ThemeToggle"; 

export default function Header() {
  return (
    // hidden md:flex означает: скрыть на мобильных, показать на ПК
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 hidden md:flex items-center h-16">
      <div className="layout-container flex items-center justify-between">
        
        {/* Логотип */}
        <Link href="/" className="text-xl font-black tracking-tighter text-foreground">
          HEALTH<span className="text-blue-600 font-normal">PSY</span>
        </Link>

        {/* Навигация */}
        <nav className="flex items-center gap-6 text-sm font-bold text-gray-600 dark:text-gray-300">
          <Link href="/search" className="hover:text-blue-600 transition-colors">Поиск</Link>
          <Link href="/bookmarks" className="hover:text-blue-600 transition-colors">Закладки</Link>
          <ThemeToggle />
        </nav>
        
      </div>
    </header>
  );
}