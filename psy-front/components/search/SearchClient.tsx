// === НАЧАЛО БЛОКА: Клиентский Поиск (Algolia) ===
"use client";

import { liteClient } from "algoliasearch/lite";
import { InstantSearch, useSearchBox, useHits, Configure } from "react-instantsearch";
import { Search } from "lucide-react";
import Link from "next/link";
import BookmarkButton from "@/components/ui/BookmarkButton";

// Инициализация клиента Algolia (используем liteClient для v5)
// Если ключей нет в .env, предотвращаем падение приложения
const searchClient = liteClient(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "APP_ID_MISSING",
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || "API_KEY_MISSING"
);

// Кастомное поле ввода (SearchBox), стилизованное под наш дизайн
function CustomSearchBox() {
  const { query, refine } = useSearchBox();

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-0 flex items-center pl-7 pointer-events-none text-gray-400">
        <Search size={20} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => refine(e.target.value)}
        placeholder="Найти статью, тему или автора..."
        className="w-full py-4 pl-14 pr-7 text-lg bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
      />
    </div>
  );
}

// Кастомный вывод результатов (Hits)
function CustomHits() {
  const { hits } = useHits();

  if (hits.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-zinc-500 font-medium">
        Ничего не найдено. Попробуйте другой запрос.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {hits.map((article: any) => (
        <Link
          href={`/post/${article.slug?.current || article.slug}`}
          key={article.objectID || article._id}
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
              <BookmarkButton articleId={article.objectID || article._id} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

interface SearchClientProps {
  initialArticles: any[]; // Оставляем для совместимости, но теперь данные тянет Algolia
}

export default function SearchClient({ initialArticles }: SearchClientProps) {
  // Имя индекса Algolia (создай его в панели управления Algolia)
  const indexName = "posts_index"; 

  return (
    <div id="search-client-algolia" className="space-y-8">
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        {/* Настройки поиска (искать только по этим полям) */}
        <Configure hitsPerPage={10} />
        
        <CustomSearchBox />
        
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pl-2">
            Результаты поиска
          </h2>
          <CustomHits />
        </div>
      </InstantSearch>
    </div>
  );
}
// === КОНЕЦ БЛОКА ===