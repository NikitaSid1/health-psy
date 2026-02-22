// C:\Users\Admin\Desktop\psy\psy-front\app\[lang]\search\page.tsx
import { client } from "@/lib/sanity";
import { searchArticlesQuery } from "@/lib/queries";
import Link from "next/link";
import BookmarkButton from "@/components/ui/BookmarkButton";

const pageTranslations = {
  ru: { title: "Результаты поиска", empty: "По запросу ничего не найдено:", back: "Вернуться на главную", article: "Статья" },
  en: { title: "Search Results", empty: "Nothing found for:", back: "Back to home", article: "Article" },
  ua: { title: "Результати пошуку", empty: "За запитом нічого не знайдено:", back: "Повернутися на головну", article: "Стаття" },
  pl: { title: "Wyniki wyszukiwania", empty: "Nic nie znaleziono dla:", back: "Wróć do strony głównej", article: "Artykuł" },
  de: { title: "Suchergebnisse", empty: "Nichts gefunden für:", back: "Zurück zur Startseite", article: "Artikel" },
};

interface SearchPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage(props: SearchPageProps) {
  // В Next.js 15 params и searchParams нужно await'ить
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const lang = params.lang || "ru";
  const q = searchParams.q || "";
  const t = pageTranslations[lang as keyof typeof pageTranslations] || pageTranslations.ru;

  let articles: any[] = [];

  if (q) {
    // ВАЖНО: Мы оборачиваем запрос в звездочки *${q}* , чтобы Sanity искал частичные совпадения (как LIKE %q% в SQL)
    articles = await client.fetch(searchArticlesQuery, { 
      lang, 
      searchQuery: `*${q}*` 
    });
  }

  return (
    <main className="min-h-[70vh] layout-container px-4 md:px-8 pt-24 pb-20">
      
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-[#111827] dark:text-zinc-50 mb-4">
          {t.title}
        </h1>
        {q && (
          <p className="text-lg text-gray-600 dark:text-gray-400">
            «{q}» — {articles.length} {articles.length === 1 ? 'результат' : 'результатов'}
          </p>
        )}
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 max-w-2xl mx-auto bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-gray-100 dark:border-zinc-800">
          <p className="text-xl text-gray-500 dark:text-zinc-400 mb-6 font-medium">
            {t.empty} <span className="font-bold text-gray-900 dark:text-white">«{q}»</span>
          </p>
          <Link 
            href={`/${lang}`} 
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors"
          >
            {t.back}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {articles.map((article: any) => (
            <Link
              href={`/${lang}/post/${article.slug}`}
              key={article._id}
              className="flex flex-col justify-between p-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-zinc-800 rounded-[24px] hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-xl dark:shadow-none transition-all group"
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
                    return tag?.name ? (
                      <span key={idx} className="text-[10px] font-bold text-gray-500 uppercase tracking-wide bg-gray-100 dark:bg-zinc-800 px-2 py-1.5 rounded-md">
                        #{tag.name}
                      </span>
                    ) : null;
                  })}
                </div>

                <div className="z-10 shrink-0" onClick={(e) => e.preventDefault()}>
                  <BookmarkButton articleId={article._id} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}