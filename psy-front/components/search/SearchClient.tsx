// C:\Users\Admin\Desktop\psy\psy-front\components\search\SearchClient.tsx
// === НАЧАЛО БЛОКА: Клиентский Поиск (Полноэкранная Модалка Algolia) ===
"use client";

import { useEffect, useRef } from "react";
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

function CustomSearchBox({ t, onClose }: { t: any; onClose: () => void }) {
  const { query, refine } = useSearchBox();

  return (
    <div id="algolia-search-box" className="relative w-full max-w-4xl mx-auto flex items-center gap-4">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
          <Search size={24} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => refine(e.target.value)}
          placeholder={t.placeholder}
          autoFocus
          className="w-full py-5 pl-[56px] pr-12 text-[18px] sm:text-[22px] bg-white dark:bg-[#111827] border border-gray-200 dark:border-zinc-800 text-[#111827] dark:text-[#f3f4f6] rounded-[24px] focus:outline-none focus:ring-4 focus:ring-blue-600/20 shadow-lg dark:shadow-none transition-all"
        />
        {query && (
          <button
            onClick={() => refine("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
      
      {/* Кнопка закрытия модалки */}
      <button 
        onClick={onClose}
        className="shrink-0 p-4 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
        aria-label="Close search"
      >
        <X size={24} />
      </button>
    </div>
  );
}

function CustomHits({ lang, t, onClose }: { lang: string; t: any; onClose: () => void }) {
  const { hits } = useHits();

  if (hits.length === 0) {
    return (
      <div id="algolia-empty-state" className="text-center py-20 text-gray-500 dark:text-zinc-500 font-medium text-lg">
        {t.empty}
      </div>
    );
  }

  return (
    <div id="algolia-hits-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto pb-24">
      {hits.map((article: any) => (
        <Link
          href={`/${lang}/post/${article.slug?.current || article.slug}`}
          key={article.objectID || article._id}
          onClick={onClose} // Закрываем модалку при переходе по ссылке
          className="flex flex-col justify-between p-6 bg-white dark:bg-[#111827] border border-gray-100 dark:border-zinc-800 rounded-[24px] hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-md hover:shadow-xl dark:shadow-none transition-all"
        >
          <div>
            <h3 className="text-xl font-extrabold text-[#111827] dark:text-[#f3f4f6] tracking-tight leading-snug mb-3">
              {article.title}
            </h3>
          </div>
          <div className="flex justify-between items-start mt-6 gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full uppercase tracking-wide">
                {article.category || t.article}
              </span>
              
              {article.tags && article.tags.map((tag: any, idx: number) => {
                const tagName = typeof tag === 'object' ? tag.name : tag;
                return tagName ? (
                  <span key={idx} className="text-[10px] font-bold text-gray-500 uppercase tracking-wide bg-gray-100 dark:bg-zinc-800 px-2 py-1.5 rounded-md">
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

interface SearchClientProps {
  lang: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchClient({ lang, isOpen, onClose }: SearchClientProps) {
  const indexName = "posts_index"; 
  const t = searchTranslations[lang as keyof typeof searchTranslations] || searchTranslations.en;
  const modalRef = useRef<HTMLDivElement>(null);

  // Блокировка скролла и закрытие по Esc
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-gray-50/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="min-h-screen px-4 py-8 md:py-12" ref={modalRef}>
        <InstantSearch searchClient={searchClient} indexName={indexName}>
          {/* Фильтруем результаты по текущему языку, чтобы не мешать статьи разных языков */}
          <Configure hitsPerPage={12} filters={`language:${lang}`} />
          
          <CustomSearchBox t={t} onClose={onClose} />
          
          <div id="search-results-wrapper" className="mt-8 max-w-6xl mx-auto">
            <h2 className="text-sm font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-6 pl-2">
              {t.results}
            </h2>
            <CustomHits lang={lang} t={t} onClose={onClose} />
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}
// === КОНЕЦ БЛОКА ===