// === НАЧАЛО БЛОКА: Article Card (Fixed Layout & Lang) ===
"use client";

import Link from "next/link";
import Image from "next/image";
import BookmarkButton from "@/components/ui/BookmarkButton";

// Словари
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
    language?: string;
  };
  lang?: string; // Язык интерфейса
}

export default function ArticleCard({ post, lang = "ru" }: ArticleCardProps) {
  // ЛОГИКА ЯЗЫКА:
  // 1. Если у поста явно задан язык (post.language), берем его (важно для закладок).
  // 2. Если нет (старый пост), берем язык интерфейса (lang) (важно для главной ua).
  // 3. Если и того нет, фолбэк на ru.
  const articleLang = post.language || lang || "ru";

  const timeLabel = TIME_LABELS[articleLang] || "min";
  const expertLabel = EXPERT_LABELS[articleLang] || "Expert";
  const defaultCategory = DEFAULT_CATEGORIES[articleLang] || "Psychology";

  return (
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
          {/* Верхняя строка: Инфо + Кнопка */}
          {/* justify-between + gap-3 предотвращает наезд текста на кнопку */}
          <div className="flex items-start justify-between mb-3 gap-3">
            
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider mt-1.5">
              <span className="text-blue-600 dark:text-blue-400 whitespace-nowrap">
                {post.category || defaultCategory}
              </span>
              <span className="text-gray-300 dark:text-zinc-700">•</span>
              <span className="text-gray-500 whitespace-nowrap">
                {post.readTime || 5} {timeLabel}
              </span>
            </div>
            
            {/* Кнопка: flex-shrink-0 не дает ей сжиматься, z-10 поднимает над ссылкой */}
            <div className="z-10 relative flex-shrink-0" onClick={(e) => e.preventDefault()}>
                <BookmarkButton articleId={post._id} />
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>

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