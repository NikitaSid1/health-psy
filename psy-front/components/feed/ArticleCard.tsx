// === НАЧАЛО БЛОКА: Article Card (Smart Localization) ===
"use client";

import Link from "next/link";
import Image from "next/image";
import BookmarkButton from "@/components/ui/BookmarkButton";

// Словари для перевода "на лету" в зависимости от языка СТАТЬИ
const TIME_LABELS: Record<string, string> = {
  ru: "мин",
  en: "min",
  ua: "хв",
  pl: "min",
  de: "Min",
};

const EXPERT_LABELS: Record<string, string> = {
  ru: "Проверено экспертом",
  en: "Verified by expert",
  ua: "Перевірено експертом",
  pl: "Sprawdzone przez eksperta",
  de: "Von Experten geprüft",
};

const DEFAULT_CATEGORIES: Record<string, string> = {
  ru: "Психология",
  en: "Psychology",
  ua: "Психологія",
  pl: "Psychologia",
  de: "Psychologie",
};

interface ArticleCardProps {
  post: {
    _id: string;
    title: string;
    slug: string;
    category?: string;
    readTime?: number;
    expert?: boolean;
    mainImage?: string;
    language?: string; // Язык приходит из Sanity
  };
  lang?: string; // Язык интерфейса (резервный)
}

export default function ArticleCard({ post, lang = "ru" }: ArticleCardProps) {
  // 1. ОПРЕДЕЛЯЕМ ЯЗЫК:
  // Главная фишка: Если у статьи есть свой язык (post.language), используем его.
  // Это чинит проблему в закладках: английская статья будет с "min", даже если сайт на русском.
  const articleLang = post.language || lang || "ru";

  // 2. Подбираем словари
  const timeLabel = TIME_LABELS[articleLang] || "min";
  const expertLabel = EXPERT_LABELS[articleLang] || "Expert";
  const defaultCategory = DEFAULT_CATEGORIES[articleLang] || "Psychology";

  return (
    // Ссылка тоже строится на базе языка статьи
    <Link 
      href={`/${articleLang}/post/${post.slug}`} 
      className="group block outline-none h-full"
    >
      <article className="card-editorial h-full flex flex-col hover:translate-y-[-4px] transition-all duration-300">
        
        {/* Картинка */}
        <div className="relative w-full aspect-[4/3] rounded-2xl bg-gray-100 dark:bg-zinc-800 mb-5 overflow-hidden shadow-sm">
          {post.mainImage ? (
            <Image 
              src={post.mainImage} 
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
                <span className="text-gray-300 dark:text-zinc-700 font-bold text-4xl opacity-20">PSY</span>
            </div>
          )}
        </div>

        {/* Текстовая часть */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
              {/* Категория */}
              <span className="text-blue-600 dark:text-blue-400">
                {post.category || defaultCategory}
              </span>
              <span className="text-gray-300 dark:text-zinc-700">•</span>
              {/* Время чтения (мин/min/хв) */}
              <span className="text-gray-500">
                {post.readTime || 5} {timeLabel}
              </span>
            </div>
            
            {/* Кнопка закладки (не нажимает ссылку карточки) */}
            <div className="z-10 relative" onClick={(e) => e.preventDefault()}>
                <BookmarkButton articleId={post._id} />
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Плашка эксперта */}
          {post.expert && (
            <div className="mt-auto pt-3 flex items-center gap-2">
                <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                  ✓ {expertLabel}
                </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
// === КОНЕЦ БЛОКА ===