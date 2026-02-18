// === НАЧАЛО БЛОКА: Bookmarks Page ===
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/lib/sanity";
import { bookmarkedArticlesQuery } from "@/lib/queries";
import BookmarkButton from "@/components/ui/BookmarkButton";
import { Loader2 } from "lucide-react";

// Словари для времени чтения (зависят от языка статьи)
const TIME_LABELS: Record<string, string> = {
  ru: "мин",
  en: "min",
  ua: "хв",
  pl: "min",
  de: "Min",
};

// Словари для интерфейса (зависят от языка сайта)
const UI_TEXT: Record<string, { title: string; empty: string; loading: string; back: string }> = {
  ru: { title: "Избранное", empty: "У вас пока нет сохраненных статей", loading: "Загрузка...", back: "Вернуться на главную" },
  en: { title: "Bookmarks", empty: "You haven't saved any articles yet", loading: "Loading...", back: "Back to home" },
  ua: { title: "Збережене", empty: "У вас поки немає збережених статей", loading: "Завантаження...", back: "На головну" },
  pl: { title: "Zakładki", empty: "Nie masz jeszcze zapisanych artykułów", loading: "Ładowanie...", back: "Wróć do strony głównej" },
  de: { title: "Lesezeichen", empty: "Sie haben noch keine Artikel gespeichert", loading: "Laden...", back: "Zurück zur Startseite" },
};

interface Article {
  _id: string;
  title: string;
  slug: string;
  category: string;
  readTime: number;
  expert: boolean;
  mainImage: string;
  language: string; // Sanity возвращает язык статьи
}

export default function BookmarksPage({ params }: { params: { lang: string } }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Выбираем текст интерфейса
  const t = UI_TEXT[params.lang as keyof typeof UI_TEXT] || UI_TEXT.ru;

  useEffect(() => {
    const fetchBookmarks = async () => {
      // 1. Берем ID из localStorage
      const saved = localStorage.getItem("bookmarkedArticles");
      if (!saved) {
        setLoading(false);
        return;
      }
      
      const ids = JSON.parse(saved);
      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      // 2. Делаем запрос в Sanity
      try {
        const data = await client.fetch(bookmarkedArticlesQuery, { ids });
        setArticles(data);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  // Слушаем изменения localStorage (если удалили закладку в другом окне/компоненте)
  useEffect(() => {
    const handleStorageChange = () => {
       const saved = localStorage.getItem("bookmarkedArticles");
       const ids = saved ? JSON.parse(saved) : [];
       // Фильтруем текущий список, оставляя только те, что есть в ids
       setArticles(prev => prev.filter(a => ids.includes(a._id)));
    };

    window.addEventListener('storage', handleStorageChange);
    // Наш кастомный эвент, если BookmarkButton используется на этой же странице
    window.addEventListener('bookmarksUpdated', handleStorageChange); 
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bookmarksUpdated', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8 dark:text-white">{t.title}</h1>

      {articles.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">{t.empty}</p>
          <Link href={`/${params.lang}`} className="btn-primary">
            {t.back}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((post) => {
            // === ЛОГИКА ЯЗЫКА ===
            // 1. Определяем язык этой конкретной статьи
            const articleLang = post.language || params.lang || "ru";
            // 2. Берем правильное окончание (мин, min, хв)
            const timeLabel = TIME_LABELS[articleLang] || "min";

            return (
              <div key={post._id} className="group flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                 {/* Ссылка на статью */}
                 <Link href={`/${articleLang}/post/${post.slug}`} className="block h-full">
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      {post.mainImage && (
                        <Image
                          src={post.mainImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    
                    <div className="p-5 pb-16"> {/* pb-16 чтобы оставить место для футера */}
                      <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                        {post.category || "Psychology"}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                        {post.title}
                      </h3>
                    </div>
                 </Link>

                 {/* Футер карточки (время + кнопка удаления) */}
                 {/* ВАЖНО: z-10 чтобы кнопка работала поверх ссылки */}
                 <div className="absolute bottom-0 left-0 right-0 p-5 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <span className="text-sm font-medium text-gray-500">
                      {/* ВОТ ЗДЕСЬ ИСПРАВЛЕНИЕ: Число + правильный суффикс */}
                      {post.readTime || 5} {timeLabel}
                    </span>
                    
                    <div className="z-10 relative" onClick={(e) => {
                        // Эта функция обновляет стейт страницы сразу после клика
                        e.stopPropagation(); // Чтобы не переходило по ссылке
                        // BookmarkButton сам удалит из LS и кинет событие, которое мы ловим в useEffect
                    }}>
                      <BookmarkButton articleId={post._id} />
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
// === КОНЕЦ БЛОКА ===