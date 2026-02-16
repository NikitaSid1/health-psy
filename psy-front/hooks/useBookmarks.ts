// === НАЧАЛО БЛОКА: Хук Закладок (localStorage) ===
"use client";

import { useState, useEffect } from "react";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Защита от Hydration Mismatch: читаем localStorage ТОЛЬКО после маунта клиента
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("health_psy_bookmarks");
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Ошибка чтения закладок:", error);
    }
  }, []);

  const toggleBookmark = (id: string) => {
    let updatedBookmarks;
    if (bookmarks.includes(id)) {
      updatedBookmarks = bookmarks.filter((bId) => bId !== id);
    } else {
      updatedBookmarks = [...bookmarks, id];
    }
    
    setBookmarks(updatedBookmarks);
    try {
      localStorage.setItem("health_psy_bookmarks", JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error("Ошибка сохранения закладок:", error);
    }
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  return { bookmarks, toggleBookmark, isBookmarked, mounted };
}
// === КОНЕЦ БЛОКА ===