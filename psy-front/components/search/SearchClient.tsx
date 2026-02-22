// C:\Users\Admin\Desktop\psy\psy-front\components\search\SearchClient.tsx
// === НАЧАЛО БЛОКА: Клиентский Поиск (Полноэкранная Модалка + Insights + Empty State) ===
"use client";

import { useEffect, useRef } from "react";
import { liteClient } from "algoliasearch/lite";
import { InstantSearch, useSearchBox, useHits, Configure } from "react-instantsearch";
import { Search, X } from "lucide-react";
import Link from "next/link";
import BookmarkButton from "@/components/ui/BookmarkButton";

// Инициализация Algolia
const searchClient = liteClient(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "APP_ID_MISSING",
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || "API_KEY_MISSING"
);

// Мультиязычный словарь с популярными категориями для "Empty State"
const searchTranslations = {
  ru: { placeholder: "Найти статью, тег или автора...", empty: "Упс! Ничего не найдено.", popular: "Популярные категории", popularTags: ["Тревожность", "Саморазвитие", "Отношения", "Стресс"], results: "Результаты поиска", article: "Статья" },
  en: { placeholder: "Search article, tag, or author...", empty: "Oops! Nothing found.", popular: "Popular Categories", popularTags: ["Anxiety", "Self-development", "Relationships", "Stress"], results: "Search results", article: "Article" },
  ua: { placeholder: "Знайти статтю, тег або автора...", empty: "Упс! Нічого не знайдено.", popular: "Популярні категорії", popularTags: ["Тривожність", "Саморозвиток", "Стосунки", "Стрес"], results: "Результати пошуку", article: "Стаття" },
  pl: { placeholder: "Szukaj artykułu, tagu lub autora...", empty: "Ups! Nic nie znaleziono.", popular: "Popularne kategorie", popularTags: ["Niepokój", "Samorozwój", "Relacje", "Stres"], results: "Wyniki wyszukiwania", article: "Artykuł" },
  de: { placeholder: "Artikel, Tag oder Autor suchen...", empty: "Hoppla! Nichts gefunden.", popular: "Beliebte Kategorien", popularTags: ["Angst", "Selbstentwicklung", "Beziehungen", "Stress"], results: "Suchergebnisse", article: "Artikel" },
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
  // Достаем sendEvent из хука useHits для проброса аналитики в Algolia Insights
  const { hits, sendEvent } = useHits();
  const { refine } = useSearchBox(); // Вызываем refine, чтобы можно было кликать по популярным тегам

  // СМАРТ EMPTY STATE: Удерживаем юзера, если ничего не найдено
  if (hits.length === 0) {
    return (
      <div id="algolia-empty-state" className="text-center py-24 animate-in fade-in duration-500 max-w-2xl mx-auto">
        <p className="text-gray-500 dark:text-zinc-400 font-medium text-xl mb-8">{t.empty}</p>
        
        <div className="space-y-5 bg-white dark:bg-[#111827] p-8 rounded-[32px] border border-gray-100 dark:border-zinc-800 shadow-sm dark:shadow-none">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
            {t.popular}
          </h4>
          <div className="flex flex-wrap justify-center gap-3">
            {t.popularTags.map((tag: string) => (
              <button
                key={tag}
                onClick={() => refine(tag)} // При клике подставляем тег в поиск
                className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-[#111827] dark:text-[#f3f4f6] px-5 py-2.5 rounded-full text-sm font-bold hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="algolia-hits-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto pb-24">
      {hits.map((article: any) => (
        <Link
          href={`/${lang}/post/${article.slug?.current || article.slug}`}
          key={article.objectID || article._id}
          onClick={() => {
            // ALGOLIA INSIGHTS: Отправляем событие клика!
            sendEvent('click', article, 'Article Viewed');
            onClose(); // Закрываем модалку при переходе
          }} 
          className="flex flex-col justify-between p-6 bg-white dark:bg-[#111827] border border-gray-100 dark:border-zinc-800 rounded-[24px] hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-md hover:shadow-xl dark:shadow-none transition-all group"
        >
          <div>
            <h3 className="text-xl font-extrabold text-[#111827] dark:text-[#f3f4f6] tracking-tight leading-snug mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
        {/* ALGOLIA INSIGHTS: Активируем параметр insights={true} */}
        <InstantSearch searchClient={searchClient} indexName={indexName} insights={true}>
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