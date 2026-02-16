// === НАЧАЛО БЛОКА: Кнопка Закладки ===
"use client";

import { useBookmarks } from "@/hooks/useBookmarks";
import { triggerHaptic } from "@/lib/haptic";

interface BookmarkButtonProps {
  articleId: string;
  className?: string; // Для кастомных отступов извне
}

export default function BookmarkButton({ articleId, className = "" }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark, mounted } = useBookmarks();

  // Пока клиент не загрузился, показываем пустой квадрат, чтобы не было прыжков
  if (!mounted) return <div className={`w-10 h-10 ${className}`} />;

  const active = isBookmarked(articleId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Если кнопка внутри Link, предотвращаем переход по ссылке
    triggerHaptic(active ? "light" : "medium"); // Виброотклик (п. 26 ТЗ)
    toggleBookmark(articleId);
  };

  return (
    <button
      id={`bookmark-btn-${articleId}`}
      onClick={handleClick}
      className={`p-2 rounded-full transition-colors duration-300 ${
        active 
          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
          : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white"
      } ${className}`}
      aria-label="Добавить в закладки"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" height="20" 
        viewBox="0 0 24 24" 
        fill={active ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
      </svg>
    </button>
  );
}
// === КОНЕЦ БЛОКА ===