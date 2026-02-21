// C:\Users\Admin\Desktop\psy\psy-front\components\search\SearchClient.tsx
// === НАЧАЛО БЛОКА: Клиентский Поиск (Algolia) ===
"use client";

import { liteClient } from "algoliasearch/lite";
import { InstantSearch, useSearchBox, useHits, Configure } from "react-instantsearch";
import { Search, X } from "lucide-react";
import Link from "next/link";
import BookmarkButton from "@/components/ui/BookmarkButton";

const searchClient = liteClient(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "APP_ID_MISSING",
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || "API_KEY_MISSING"
);

const searchTranslations = {
  ru: { placeholder: "Найти статью, тег или автора...", empty: "Ничего не найдено. Попробуйте другой запрос.", results: "Результаты поиска", article: "Статья" },
  en: { placeholder: "Search article, tag, or author...", empty: "No results found. Try another query.", results: "Search results", article: "Article" },
  ua: { placeholder: "Знайти статтю, тег або автора...", empty: "Нічого не знайдено. Спробуйте інший запит.", results: "Результати пошуку", article: "Стаття" },
  pl: { placeholder: "Szukaj artykułu, tagu lub autora...", empty: "Nic nie znaleziono. Spróbuj innego zapytania.", results: "Wyniki wyszukiwania", article: "Artykuł" },
  de: { placeholder: "Artikel, Tag oder Autor suchen...", empty: "Nichts gefunden. Versuchen Sie eine andere Suchanfrage.", results: "Suchergebnisse", article: "Artikel" },
};

function CustomSearchBox({ t }: { t: any }) {
  const { query, refine } = useSearchBox();

  return (
    <div id="algolia-search-box" className="relative w-full max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
        <Search size={20} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => refine(e.target.value)}
        placeholder={t.placeholder}
        className="w-full py-4 pl-[48px] pr-12 text-[16px] sm:text-[18px] bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 text-[#111827] dark:text-[#f3f4f6] rounded-[24px] focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm dark:shadow-none transition-all"
      />
      {query && (
        <button
          onClick={() => refine("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

function CustomHits({ lang, t }: { lang: string, t: any }) {
  const { hits } = useHits();

  if (hits.length === 0) {
    return (
      <div id="algolia-empty-state" className="text-center py-10 text-gray-500 dark:text-zinc-500 font-medium">
        {t.empty}
      </div>
    );
  }

  return (
    <div id="algolia-hits-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {hits.map((article: any) => (
        <Link
          href={`/${lang}/post/${article.slug?.current || article.slug}`}
          key={article.objectID || article._id}
          className="flex flex-col justify-between p-6 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 rounded-[24px] hover:border-gray-300 dark:hover:border-zinc-700 shadow-sm dark:shadow-none transition-colors"
        >
          <div>
            <h3 className="text-lg font-extrabold text-[#111827] dark:text-[#f3f4f6] tracking-tight leading-relaxed mb-2">
              {article.title}
            </h3>
          </div>
          <div className="flex justify-between items-start mt-4 gap-4">
            
            {/* ИСПРАВЛЕНИЕ: Вывод категории + красивый вывод новых тегов */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                {article.category || t.article}
              </span>
              
              {/* Проверяем, отдала ли Algolia теги. Если да — красиво рендерим */}
              {article.tags && article.tags.map((tag: any, idx: number) => {
                const tagName = typeof tag === 'object' ? tag.name : tag;
                return tagName ? (
                  <span key={idx} className="text-[10px] font-bold text-gray-500 uppercase tracking-wide bg-gray-50 dark:bg-zinc-800/50 px-2 py-1 rounded-md">
                    #{tagName}
                  </span>
                ) : null;
              })}
            </div>

            <div className="z-10 shrink-0" onClick={(e) => e.preventDefault()}>
              <BookmarkButton articleId={article.objectID || article._id} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function SearchClient({ lang }: { lang: string }) {
  const indexName = "posts_index"; 
  const t = searchTranslations[lang as keyof typeof searchTranslations] || searchTranslations.en;

  return (
    <div id="search-client-algolia" className="space-y-8">
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        <Configure hitsPerPage={10} />
        <CustomSearchBox t={t} />
        <div id="search-results-wrapper">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pl-2">
            {t.results}
          </h2>
          <CustomHits lang={lang} t={t} />
        </div>
      </InstantSearch>
    </div>
  );
}
// === КОНЕЦ БЛОКА ===