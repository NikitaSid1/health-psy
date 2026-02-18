// === НАЧАЛО БЛОКА: Feed with Inline Search ===
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react"; // Добавили X
import BookmarkButton from "@/components/ui/BookmarkButton";

interface Article {
  _id: string;
  title: string;
  slug: string;
  category: string;
  readTime: number;
  expert: boolean;
  mainImage: string;
}

interface SearchAndFeedProps {
  initialArticles: Article[];
  lang: string; 
}

// Словари для локализации внутри компонента
const componentTranslations = {
  ru: {
    placeholder: "Найти статью, тему или автора...",
    resultsFor: "Результаты поиска",
    latest: "Свежие материалы",
    notFound: "Ничего не найдено по запросу",
    verified: "Проверено экспертом",
    categoryDefault: "Психология",
    tags: ["Токсичность", "Личные границы", "Тревожность", "Стресс", "Привязанность"]
  },
  en: {
    placeholder: "Search for article, topic or author...",
    resultsFor: "Search results",
    latest: "Latest articles",
    notFound: "Nothing found for",
    verified: "Verified by expert",
    categoryDefault: "Psychology",
    tags: ["Toxicity", "Boundaries", "Anxiety", "Stress", "Attachment"]
  },
  ua: {
    placeholder: "Знайти статтю, тему або автора...",
    resultsFor: "Результати пошуку",
    latest: "Свіжі матеріали",
    notFound: "Нічого не знайдено за запитом",
    verified: "Перевірено експертом",
    categoryDefault: "Психологія",
    tags: ["Токсичність", "Особисті кордони", "Тривожність", "Стрес", "Прихильність"]
  },
  pl: {
    placeholder: "Szukaj artykułu, tematu lub autora...",
    resultsFor: "Wyniki wyszukiwania",
    latest: "Najnowsze artykuły",
    notFound: "Nic nie znaleziono dla",
    verified: "Sprawdzone przez eksperta",
    categoryDefault: "Psychologia",
    tags: ["Toksyczność", "Granice", "Lęk", "Stres", "Przywiązanie"]
  },
  de: {
    placeholder: "Artikel, Thema oder Autor suchen...",
    resultsFor: "Suchergebnisse",
    latest: "Neueste Artikel",
    notFound: "Nichts gefunden für",
    verified: "Von Experten geprüft",
    categoryDefault: "Psychologie",
    tags: ["Toxizität", "Grenzen", "Angst", "Stress", "Bindung"]
  }
};

export default function SearchAndFeed({ initialArticles, lang }: SearchAndFeedProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Article[]>(initialArticles);

  // Получаем нужные переводы на основе пропса lang
  const t = componentTranslations[lang as keyof typeof componentTranslations] || componentTranslations.ru;
  const currentTags = t.tags;

  // Дебаунс (задержка ввода)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
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
      (article.category && article.category.toLowerCase().includes(lowerQuery))
    );
    
    setResults(filtered);
  }, [debouncedQuery, initialArticles]);

  return (
    <div className="space-y-10">
      
      {/* 1. Блок Поиска и Тегов */}
      <section id="search-section" className="space-y-6">
        <div className="relative w-full max-w-2xl mx-auto">
          {/* Иконка поиска */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-gray-400">
            <Search size={20} />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            // pr-12 чтобы текст не наезжал на крестик
            className="w-full py-4 pl-12 pr-12 text-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all placeholder:text-gray-400"
          />

          {/* Кнопка очистки (Крестик) */}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-3 flex items-center p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label="Очистить"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Теги */}
        <div id="tags-carousel" className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory scroll-smooth w-full px-1">
          {currentTags.map((tag) => (
            <button 
              key={tag} 
              onClick={() => setQuery(tag)} 
              className={`tag-pill whitespace-nowrap snap-center cursor-pointer transition-colors px-4 py-2 rounded-full border text-sm font-medium ${
                query.toLowerCase() === tag.toLowerCase() 
                  ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-600 dark:text-white' 
                  : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Лента Статей (Результаты) */}
      <section id="latest-articles" className="space-y-8">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-50 tracking-tight">
          {query ? `${t.resultsFor} (${results.length})` : t.latest}
        </h2>

        {results.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-zinc-500 font-medium bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800">
            <p className="mb-2">{t.notFound} «{query}»</p>
            <button onClick={() => setQuery("")} className="text-blue-600 hover:underline">
              {lang === 'en' ? 'Clear search' : 'Очистить поиск'}
            </button>
          </div>
        ) : (
          <div id="articles-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((article, index) => (
              // ВАЖНО: Добавил ${lang} в ссылку, чтобы сохранять язык при переходе
              <Link key={article._id} href={`/${lang}/post/${article.slug}`} className="group block outline-none h-full">
                <article className="card-editorial h-full flex flex-col hover:translate-y-[-4px] transition-all duration-300">
                  
                  <div className="relative w-full aspect-[4/3] rounded-2xl bg-gray-100 dark:bg-zinc-800 mb-5 overflow-hidden shadow-sm">
                    {article.mainImage ? (
                      <Image 
                        src={article.mainImage} 
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 2 && !query}
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
                         <span className="text-gray-300 dark:text-zinc-700 font-bold text-4xl opacity-20">PSY</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
                        <span className="text-blue-600 dark:text-blue-400">{article.category || t.categoryDefault}</span>
                        <span className="text-gray-300 dark:text-zinc-700">•</span>
                        <span className="text-gray-500">{article.readTime || 5} min</span>
                      </div>
                      
                      <div className="z-10 relative" onClick={(e) => e.preventDefault()}>
                         <BookmarkButton articleId={article._id} />
                      </div>
                    </div>

                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    {article.expert && (
                      <div className="mt-auto pt-3 flex items-center gap-2">
                         <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                           ✓ {t.verified}
                         </span>
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
// === КОНЕЦ БЛОКА ===