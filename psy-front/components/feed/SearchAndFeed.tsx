// === НАЧАЛО БЛОКА: Feed with Inline Search ===
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
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

// 1. ДОБАВЛЕН lang в интерфейс
interface SearchAndFeedProps {
  initialArticles: Article[];
  lang: string; 
}

// 2. Словари для локализации внутри компонента
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

// 3. ДОБАВЛЕН lang в параметры компонента
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
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-7 pointer-events-none text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            className="w-full py-4 pl-14 pr-7 text-lg bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
          />
        </div>

        {/* Теги */}
        <div id="tags-carousel" className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory scroll-smooth">
          {currentTags.map((tag) => (
            <button 
              key={tag} 
              onClick={() => setQuery(tag)} 
              className={`tag-pill whitespace-nowrap snap-center cursor-pointer transition-colors ${
                query.toLowerCase() === tag.toLowerCase() 
                  ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-600 dark:text-white' 
                  : ''
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Лента Статей (Результаты) */}
      <section id="latest-articles" className="space-y-8">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-50">
          {query ? `${t.resultsFor} (${results.length})` : t.latest}
        </h2>

        {results.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-zinc-500 font-medium">
            {t.notFound} «{query}»
          </div>
        ) : (
          <div id="articles-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((article, index) => (
              <Link key={article._id} href={`/post/${article.slug}`} className="group block outline-none">
                <article className="card-editorial h-full flex flex-col hover:border-blue-500/30 transition-all border border-transparent relative">
                  
                  <div className="relative w-full h-48 rounded-2xl bg-gray-100 dark:bg-zinc-800 mb-5 overflow-hidden">
                    {article.mainImage ? (
                      <Image 
                        src={article.mainImage} 
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index === 0 && !query}
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700" />
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
                      <span className="text-blue-600 dark:text-blue-400">{article.category || t.categoryDefault}</span>
                      <span className="text-gray-400 dark:text-zinc-600">•</span>
                      <span className="text-gray-500">{article.readTime || 5} мин</span>
                    </div>
                    
                    <div className="z-10 relative" onClick={(e) => e.preventDefault()}>
                       <BookmarkButton articleId={article._id} />
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white leading-snug mb-4 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>

                  {article.expert && (
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center gap-2">
                       <span className="text-sm font-bold text-gray-600 dark:text-zinc-400">✓ {t.verified}</span>
                    </div>
                  )}
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