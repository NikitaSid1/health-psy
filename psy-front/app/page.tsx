import Link from "next/link";
import { client } from "@/lib/sanity";
import { articlesQuery } from "@/lib/queries";

interface Article {
  _id: string;
  title: string;
  slug: string;
  category: string;
  readTime: number;
  expert: boolean;
  mainImage: string;
}

export default async function HomePage() {
  let articles: Article[] = [];
  let errorOccurred = false;

  try {
    articles = await client.fetch(articlesQuery);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    errorOccurred = true;
  }

  const mockTags = ["Токсичность", "Личные границы", "Тревожность", "Стресс", "Привязанность"];

  return (
    <main className="min-h-screen pb-24 pt-8 md:pt-16">
      <div className="layout-container space-y-10">
        
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Познай себя.</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">Научный подход к психологии.</p>
          </div>
          <div className="relative">
             <input type="text" placeholder="Что вас беспокоит?" className="input-base pl-14" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {mockTags.map((tag) => (
              <button key={tag} className="tag-pill whitespace-nowrap">#{tag}</button>
            ))}
          </div>
        </section>

        {/* Статьи */}
        <section className="space-y-8">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Свежие материалы</h2>
          
          {errorOccurred ? (
            <div className="p-10 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-center">
              <p className="text-red-500 font-bold mb-2">Упс! База данных недоступна</p>
              <p className="text-sm text-gray-500">Проверь интернет-соединение или DNS (8.8.8.8)</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link key={article._id} href={`/post/${article.slug}`} className="group block outline-none">
                  <article className="card-editorial h-full flex flex-col hover:border-blue-500/30">
                    
                    {/* Изображение */}
                    <div className="relative w-full h-48 rounded-xl bg-gray-100 dark:bg-zinc-800 mb-5 overflow-hidden">
                      {article.mainImage ? (
                        <img src={article.mainImage} alt={article.title} className="object-cover w-full h-full" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 animate-pulse" />
                      )}
                    </div>

                    {/* Мета */}
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider mb-3">
                      <span className="text-blue-600 dark:text-blue-400">{article.category || "Психология"}</span>
                      <span className="text-gray-400 dark:text-zinc-600">•</span>
                      <span className="text-gray-500">{article.readTime || 5} мин чтения</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white leading-snug mb-4 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>

                    {article.expert && (
                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center gap-2">
                         <span className="text-sm font-bold text-gray-600 dark:text-zinc-400">✓ Проверено экспертом</span>
                      </div>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}