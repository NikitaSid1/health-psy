// === НАЧАЛО БЛОКА: Search Input Component ===
"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchClient({ initialArticles }: any) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full" id="search-interactive">
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Иконка лупы (отступ 16px от края) */}
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Найти статью, тег или автора..."
          className="w-full py-4 pl-[44px] pr-[44px] bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 rounded-[24px] text-[#111827] dark:text-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm dark:shadow-none transition-all text-[16px] sm:text-[18px]"
        />
        
        {/* Крестик очистки (рендерится только если в инпуте есть текст) */}
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Очистить поиск"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Здесь ниже рендеришь результаты поиска на основе searchQuery */}
    </div>
  );
}
// === КОНЕЦ БЛОКА ===