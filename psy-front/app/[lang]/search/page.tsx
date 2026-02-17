// === НАЧАЛО БЛОКА: Страница Поиска (Server + Client) ===
import { client } from "@/lib/sanity"
import { articlesQuery } from "@/lib/queries";
import SearchClient from "@/components/search/SearchClient"; 

export const revalidate = 0; 

export default async function SearchPage() {
  const allArticles = await client.fetch(articlesQuery);

  return (
    <main id="search-page">
      <div className="layout-container">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-zinc-50 tracking-tight mb-8">
          Поиск
        </h1>
        
        <div id="search-client" className="space-y-8">
          <div className="relative w-full max-w-2xl mx-auto">
            {/* Твой клиентский компонент поиска */}
          </div>
        </div>
      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===