// === НАЧАЛО БЛОКА: Страница Закладок ===
"use client";

import { useEffect, useState } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { client } from "@/sanity/client"; 
import { bookmarkedArticlesQuery } from "@/lib/queries";
import Link from "next/link";
import BookmarkButton from "@/components/ui/BookmarkButton";

export default function BookmarksPage() {
  const { bookmarks, mounted } = useBookmarks();
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;

    const fetchBookmarks = async () => {
      if (bookmarks.length === 0) {
        setArticles([]);
        setIsLoading(false);
        return;
      }

      try {
        const data = await client.fetch(bookmarkedArticlesQuery, { ids: bookmarks });
        setArticles(data);
      } catch (error) {
        console.error("Ошибка загрузки закладок:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [bookmarks, mounted]);

  if (!mounted) return null;

  return (
    <main id="bookmarks-page">
      <div className="layout-container">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-zinc-50 tracking-tight mb-8">
          Закладки
        </h1>

        {isLoading ? (
          <div className="text-gray-500 animate-pulse font-medium">Загружаем ваши статьи...</div>
        ) : articles.length === 0 ? (
          <div className="card-editorial py-12 text-center">
            <div className="text-gray-400 dark:text-zinc-500 mb-4">У вас пока нет сохраненных статей.</div>
            <Link href="/" className="text-blue-600 font-bold hover:underline">
              Перейти к чтению
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <Link 
                href={`/post/${article.slug}`} 
                key={article._id}
                className="card-editorial group relative flex flex-col justify-between"
              >
                <div>
                  {article.category && (
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
                      {article.category}
                    </span>
                  )}
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug mb-3">
                    {article.title}
                  </h2>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <span className="text-sm font-medium text-gray-500">{article.readTime || "5 мин"} чтения</span>
                  <div className="z-10" onClick={(e) => e.preventDefault()}>
                    <BookmarkButton articleId={article._id} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===