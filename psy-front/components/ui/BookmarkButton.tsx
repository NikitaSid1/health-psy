// C:\Users\Admin\Desktop\psy\psy-front\components\ui\BookmarkButton.tsx
// === НАЧАЛО БЛОКА: Кнопка Закладки (Исправленная) ===
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { triggerHaptic } from "@/lib/haptic";

interface BookmarkButtonProps {
  articleId: string;
  className?: string;
}

export default function BookmarkButton({ articleId, className = "" }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dict, setDict] = useState<any>(null);

  const pathname = usePathname();
  const langMatch = pathname?.split("/")[1];
  const lang = ['ru', 'en', 'ua', 'pl', 'de'].includes(langMatch || "") ? langMatch : "ru";

  useEffect(() => {
    import(`@/dictionaries/${lang}.json`)
      .then((m) => setDict(m.default.bookmarkButton))
      .catch(() => import(`@/dictionaries/ru.json`).then((m) => setDict(m.default.bookmarkButton)));
  }, [lang]);

  useEffect(() => {
    setMounted(true);
    
    const checkStatus = () => {
      const saved = localStorage.getItem("bookmarkedArticles");
      if (saved) {
        const ids = JSON.parse(saved);
        setIsBookmarked(ids.includes(articleId));
      } else {
        setIsBookmarked(false);
      }
    };

    checkStatus();

    const handleUpdate = () => checkStatus();
    window.addEventListener("bookmarksUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("bookmarksUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [articleId]);

  if (!mounted) {
    return (
       <div className={`p-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 opacity-50 ${className}`}>
         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
       </div>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const saved = localStorage.getItem("bookmarkedArticles");
    let ids: string[] = saved ? JSON.parse(saved) : [];
    let newStatus = false;

    if (ids.includes(articleId)) {
      ids = ids.filter((id) => id !== articleId);
      triggerHaptic("medium");
      newStatus = false;
    } else {
      ids.push(articleId);
      triggerHaptic("light");
      newStatus = true;
    }

    localStorage.setItem("bookmarkedArticles", JSON.stringify(ids));
    setIsBookmarked(newStatus);
    window.dispatchEvent(new Event("bookmarksUpdated"));
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-colors duration-300 ${
        isBookmarked 
          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
          : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white"
      } ${className}`}
      aria-label={isBookmarked ? (dict?.remove || "Remove") : (dict?.add || "Add")}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" height="20" 
        viewBox="0 0 24 24" 
        fill={isBookmarked ? "currentColor" : "none"} 
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