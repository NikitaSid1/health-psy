// C:\Users\Admin\Desktop\psy\psy-front\components\feed\ArticleCard.tsx
// === НАЧАЛО БЛОКА: Article Card (Final) ===
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
  lang?: string;
}

export default function ArticleCard({ post, lang = "ru" }: ArticleCardProps) {
  const articleLang = post.language || lang || "ru";
  const timeLabel = TIME_LABELS[articleLang] || "min";
  const expertLabel = EXPERT_LABELS[articleLang] || "Expert";
  const defaultCategory = DEFAULT_CATEGORIES[articleLang] || "Psychology";

  return (
    <Link 
      id={`article-card-${post._id}`}
      href={`/${articleLang}/post/${post.slug}`} 
      className="group block outline-none h-full"
    >
      <article className="h-full flex flex-col bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 rounded-[24px] overflow-hidden shadow-sm dark:shadow-none hover:border-gray-300 dark:hover:border-zinc-700 transition-colors duration-300">
        
        {/* Картинка */}
        <div className="relative w-full aspect-[4/3] bg-gray-50 dark:bg-zinc-900 overflow-hidden">
          {post.mainImage ? (
            <Image 
              src={post.mainImage} 
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" 
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
                <span className="text-gray-300 dark:text-zinc-700 font-extrabold text-4xl opacity-30">PSY</span>
            </div>
          )}
        </div>

        {/* Текстовая часть (p-6 по ТЗ = 24px) */}
        <div className="flex flex-col flex-1 p-6">
          <div className="flex items-start justify-between mb-3 gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider min-w-0">
              <span className="text-blue-600 dark:text-blue-500 truncate">{post.category || defaultCategory}</span>
              <span className="text-gray-300 dark:text-zinc-700 shrink-0">•</span>
              <span className="text-gray-500 dark:text-zinc-400 shrink-0 whitespace-nowrap">{post.readTime || 5} {timeLabel}</span>
            </div>
            
            <div className="z-10 relative shrink-0" onClick={(e) => e.preventDefault()}>
                <BookmarkButton articleId={post._id} />
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-[#111827] dark:text-[#f3f4f6] tracking-tight leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {post.expert && (
            <div className="mt-auto pt-4 flex items-center gap-2 border-t border-gray-50 dark:border-zinc-800/50">
                <span className="text-[11px] font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full whitespace-nowrap">
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