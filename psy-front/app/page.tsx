// === НАЧАЛО БЛОКА: Home Page ===
import { client } from "@/lib/sanity";
import { articlesQuery } from "@/lib/queries";
import SearchAndFeed from "@/components/feed/SearchAndFeed";

export const revalidate = 60; 

export default async function HomePage() {
  let articles = [];
  let errorOccurred = false;

  try {
    articles = await client.fetch(articlesQuery);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    errorOccurred = true;
  }

  return (
    <main id="home-main">
      <div id="home-container" className="layout-container space-y-10">
        
        <section id="hero-section" className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-zinc-50">
              Познай себя.
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
              Научный подход к психологии.
            </p>
          </div>
        </section>

        {errorOccurred ? (
          <div id="error-state" className="p-10 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-center">
            <p className="text-red-500 font-bold mb-2">Упс! База данных недоступна</p>
            <p className="text-sm text-gray-500">Проверь настройки Sanity или соединение.</p>
          </div>
        ) : (
          <SearchAndFeed initialArticles={articles} />
        )}

      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===