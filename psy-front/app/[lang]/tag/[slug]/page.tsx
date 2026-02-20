// C:\Users\Admin\Desktop\psy\psy-front\app\[lang]\tag\[slug]\page.tsx
// === НАЧАЛО БЛОКА: Tag Feed Page ===
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import Link from "next/link";
import ArticleCard from "@/components/feed/ArticleCard";
import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

const pageTranslations = {
  ru: { back: "На главную", notFound: "Тег не найден", empty: "В этой категории пока нет статей." },
  en: { back: "Back Home", notFound: "Tag not found", empty: "No articles in this category yet." },
  ua: { back: "На головну", notFound: "Тег не знайдено", empty: "У цій категорії поки немає статей." },
  pl: { back: "Na stronę główną", notFound: "Nie znaleziono tagu", empty: "Brak artykułów w tej kategorii." },
  de: { back: "Zur Startseite", notFound: "Tag nicht gefunden", empty: "Noch keine Artikel in dieser Kategorie." },
};

// Динамические метаданные для SEO
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  
  // Получаем название тега для Title страницы
  const tag = await client.fetch(`*[_type == "tag" && slug.current == $slug][0]{ "name": coalesce(translations[$lang], title) }`, { lang, slug });
  
  return {
    title: `${tag?.name || 'Category'} | HealthPsy`,
    description: `Articles and insights about ${tag?.name}`,
  };
}

interface TagPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { lang, slug } = await params;
  const t = pageTranslations[lang as keyof typeof pageTranslations] || pageTranslations.ru;
  
  // 1. Сначала получаем сам тег, его системное имя и перевод
  const tag = await client.fetch(`*[_type == "tag" && slug.current == $slug][0]{ 
    title,
    "name": coalesce(translations[$lang], title)
  }`, { lang, slug });

  if (!tag) {
    return (
      <main id="tag-not-found" className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t.notFound}</h1>
          <Link href={`/${lang}`} className="text-blue-600 hover:underline">{t.back}</Link>
        </div>
      </main>
    );
  }

  // 2. УМНЫЙ ЗАПРОС: Ищем статьи по новому массиву (tags) ИЛИ по старому текстовому полю (category)
  const articlesQuery = groq`*[_type == "post" && language == $lang && (
    $slug in tags[]->slug.current || 
    category match $tagName || 
    category match $tagTitle
  )] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    readTime,
    expert,
    "mainImage": mainImage.asset->url
  }`;

  // Выполняем запрос, передавая и системное имя тега, и его локализованное имя
  const articles = await client.fetch(articlesQuery, { 
    lang, 
    slug, 
    tagName: tag.name, 
    tagTitle: tag.title 
  });

  return (
    <main id="tag-feed-main" className="layout-container space-y-10 pt-4 pb-20">
      
      {/* Навигация назад */}
      <Link 
        href={`/${lang}`} 
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft size={16} />
        {t.back}
      </Link>

      {/* Заголовок Категории */}
      <header id="tag-feed-header" className="border-b border-gray-100 dark:border-zinc-800/50 pb-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#111827] dark:text-[#f3f4f6]">
          {tag.name}
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-zinc-400 font-medium">
          {articles.length} {articles.length === 1 ? 'статья' : 'статей'}
        </p>
      </header>

      {/* Сетка Статей */}
      <section id="tag-feed-grid">
        {articles.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-zinc-900/50 rounded-[24px] border border-dashed border-gray-200 dark:border-zinc-800">
            <p className="text-gray-500 dark:text-zinc-400 font-medium">{t.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: any) => (
              <ArticleCard key={article._id} post={article} lang={lang} />
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
// === КОНЕЦ БЛОКА ===