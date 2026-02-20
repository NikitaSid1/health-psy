// C:\Users\Admin\Desktop\psy\psy-front\components\feed\SearchAndFeed.tsx
// === НАЧАЛО БЛОКА: Feed with Inline Search ===
"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react"; 
import ArticleCard from "./ArticleCard";
import { client } from "@/lib/sanity"; // <-- Добавили клиент Sanity

interface Article {
  _id: string;
  title: string;
  slug: string;
  category: string;
  readTime: number;
  expert: boolean;
  mainImage: string;
  tags?: string[]; // <-- Добавили массив тегов для фильтрации
}

interface SearchAndFeedProps {
  initialArticles: Article[];
  lang: string; 
  minReadLabel: string;
}

const componentTranslations = {
  ru: { placeholder: "Найти статью, тему или автора...", resultsFor: "Результаты поиска", latest: "Свежие материалы", notFound: "Ничего не найдено по запросу" },
  en: { placeholder: "Search for article, topic or author...", resultsFor: "Search results", latest: "Latest articles", notFound: "Nothing found for" },
  ua: { placeholder: "Знайти статтю, тему або автора...", resultsFor: "Результати пошуку", latest: "Свіжі матеріали", notFound: "Нічого не знайдено за запитом" },
  pl: { placeholder: "Szukaj artykułu, tematu lub autora...", resultsFor: "Wyniki wyszukiwania", latest: "Najnowsze artykuły", notFound: "Nic nie znaleziono dla" },
  de: { placeholder: "Artikel, Thema oder Autor suchen...", resultsFor: "Suchergebnisse", latest: "Neueste Artikel", notFound: "Nichts gefunden für" }
};

export default function SearchAndFeed({ initialArticles, lang, minReadLabel }: SearchAndFeedProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Article[]>(initialArticles);
  
  // Состояние для динамических тегов из Sanity
  const [featuredTags, setFeaturedTags] = useState<{slug: string, name: string}[]>([]);

  const t = componentTranslations[lang as keyof typeof componentTranslations] || componentTranslations.ru;

  // Загружаем теги из Sanity при монтировании компонента
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const query = `*[_type == "tag" && isFeatured == true] | order(_createdAt asc) { 
          "slug": slug.current, 
          "name": coalesce(translations[$lang], title) 
        }`;
        const data = await client.fetch(query, { lang });
        setFeaturedTags(data);
      } catch (error) {
        console.error("Ошибка загрузки тегов:", error);
      }
    };
    fetchTags();
  }, [lang]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
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
      (article.category && article.category.toLowerCase().includes(lowerQuery)) ||
      // Фильтруем также по тегам, если они есть в статье
      (article.tags && article.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
    setResults(filtered);
  }, [debouncedQuery, initialArticles]);

  return (
    <div id="search-and-feed-container" className="space-y-10">
      
      {/* 1. Блок Поиска и Тегов */}
      <section id="inline-search-section" className="space-y-6">
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
            <Search size={20} />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            className="w-full py-4 pl-[48px] pr-12 text-[16px] md:text-[18px] bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 text-[#111827] dark:text-[#f3f4f6] rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm dark:shadow-none transition-all placeholder:text-gray-400"
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-4 flex items-center p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Динамические Теги из Sanity */}
        {featuredTags.length > 0 && (
          <div id="inline-tags-carousel" className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory scroll-smooth w-full px-1">
            {featuredTags.map((tag) => {
              const isActive = query.toLowerCase() === tag.name.toLowerCase();
              return (
                <button 
                  key={tag.slug} 
                  onClick={() => setQuery(tag.name)} 
                  className={`tag-pill whitespace-nowrap snap-center cursor-pointer transition-all px-5 py-2.5 rounded-full border text-sm font-bold ${
                    isActive 
                      ? 'bg-[#111827] text-white border-[#111827] dark:bg-white dark:text-[#0a0a0a] shadow-md' 
                      : 'bg-white dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-300 hover:border-gray-300 dark:hover:border-zinc-600'
                  }`}
                >
                  #{tag.name}
                </button>
              )
            })}
          </div>
        )}
      </section>

      {/* 2. Лента Статей */}
      <section id="feed-results" className="space-y-8">
        <h2 className="text-2xl font-extrabold text-[#111827] dark:text-zinc-50 tracking-tight">
          {query ? `${t.resultsFor} (${results.length})` : t.latest}
        </h2>

        {results.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-zinc-500 font-medium bg-gray-50 dark:bg-zinc-900/50 rounded-[24px] border border-dashed border-gray-200 dark:border-zinc-800">
            <p className="mb-2">{t.notFound} «{query}»</p>
            <button onClick={() => setQuery("")} className="text-blue-600 font-bold hover:underline">
              {lang === 'en' ? 'Clear search' : 'Очистить поиск'}
            </button>
          </div>
        ) : (
          <div id="articles-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((article) => (
              <ArticleCard key={article._id} post={article} lang={lang} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
// === КОНЕЦ БЛОКА ===