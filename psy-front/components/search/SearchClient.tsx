// === НАЧАЛО БЛОКА: Клиентский Поиск ===
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react"; // Убедись, что npm i lucide-react установлен
import BookmarkButton from "@/components/ui/BookmarkButton";

interface SearchClientProps {
  initialArticles: any[]; // Принимаем все статьи с сервера
}

export default function SearchClient({ initialArticles }: SearchClientProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<any[]>(initialArticles);

  // Логика Дебаунса: ждем 300мс после последнего нажатия клавиши
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer); // Очищаем таймер, если юзер продолжает печатать
  }, [query]);

  // Фильтрация статей
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(initialArticles);
      return;
    }
    
    const lowerQuery = debouncedQuery.toLowerCase();
    const filtered = initialArticles.filter((article) => 
      article.title.toLowerCase().includes(lowerQuery) || 
      (article.category && article.category.toLowerCase().includes(lowerQuery))
    );
    
    setResults(filtered);
  }, [debouncedQuery, initialArticles]);

  return (
    <div id="search-client" className="space-y-8">
      
      {/* Search Input (Геометрия по ТЗ: py-4 px-7) */}
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 flex items-center pl-7 pointer-events-none text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти статью, тему или автора..."
          className="w-full py-4 pl-14 pr-7 text-lg bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
        />
      </div>

      {/* Результаты поиска */}
      <div>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pl-2">
          {debouncedQuery ? `Результаты (${results.length})` : "Последние статьи"}
        </h2>

        {results.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-zinc-500 font-medium">
            Ничего не найдено по запросу «{debouncedQuery}»
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((article) => (
              <Link 
                href={`/post/${article.slug}`} 
                key={article._id}
                className="flex flex-col justify-between p-5 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 rounded-2xl hover:border-gray-200 dark:hover:border-zinc-700 transition-colors"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                    {article.title}
                  </h3>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                    {article.category || "Статья"}
                  </span>
                  <div className="z-10" onClick={(e) => e.preventDefault()}>
                    <BookmarkButton articleId={article._id} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}
// === КОНЕЦ БЛОКА ===