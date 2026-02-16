// === НАЧАЛО БЛОКА: Home Page ===
import Link from "next/link";
import Image from "next/image"; // Импортируем оптимизированные изображения
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
    <main id="home-main" className="min-h-screen pb-24 pt-8 md:pt-16">
      <div id="home-container" className="layout-container space-y-10">
        
        {/* === НАЧАЛО БЛОКА: Hero Section === */}
        <section id="hero-section" className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Познай себя.</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">Научный подход к психологии.</p>
          </div>
          <div id="search-input-wrapper" className="relative">
             <input 
               id="global-search" 
               type="text" 
               placeholder="Что вас беспокоит?" 
               className="input-base pl-14" 
             />
          </div>
          <div id="tags-carousel" className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory scroll-smooth">
            {mockTags.map((tag) => (
              <button 
                key={tag} 
                className="tag-pill whitespace-nowrap snap-center"
                // Haptic будет добавлен через Client Component обертку позже, пока оставляем стилистику
              >
                #{tag}
              </button>
            ))}
          </div>
        </section>
        {/* === КОНЕЦ БЛОКА === */}

        {/* === НАЧАЛО БЛОКА: Latest Articles === */}
        <section id="latest-articles" className="space-y-8">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-50">Свежие материалы</h2>
          
          {errorOccurred ? (
            <div id="error-state" className="p-10 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-center">
              <p className="text-red-500 font-bold mb-2">Упс! База данных недоступна</p>
              <p className="text-sm text-gray-500">Проверь настройки Sanity или соединение.</p>
            </div>
          ) : (
            <div id="articles-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article, index) => (
                <Link key={article._id} href={`/post/${article.slug}`} className="group block outline-none">
                  <article className="card-editorial h-full flex flex-col hover:border-blue-500/30 transition-all border border-transparent">
                    
                    {/* Изображение: Используем Next Image для сжатия в WebP */}
                    <div className="relative w-full h-48 rounded-2xl bg-gray-100 dark:bg-zinc-800 mb-5 overflow-hidden">
                      {article.mainImage ? (
                        <Image 
                          src={article.mainImage} 
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={index === 0} // LCP оптимизация для первой картинки
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700" />
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
        {/* === КОНЕЦ БЛОКА === */}
      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===