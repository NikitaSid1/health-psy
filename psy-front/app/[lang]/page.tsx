// C:\Users\Admin\Desktop\psy\psy-front\app\[lang]\page.tsx
// === НАЧАЛО БЛОКА: Home Page (Strict Lang) ===
import { client } from "@/lib/sanity";
import { articlesQuery } from "@/lib/queries";
import SearchAndFeed from "@/components/feed/SearchAndFeed";
import { Metadata } from "next";
import { getDictionary } from "@/dictionaries/getDictionary"; // <-- Импорт загрузчика словаря

export const revalidate = 60; 

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang || "en";

  return {
    alternates: {
      canonical: `https://healthpsy.info/${lang}`,
      languages: {
        'ru': 'https://healthpsy.info/ru',
        'en': 'https://healthpsy.info/en',
        'uk': 'https://healthpsy.info/ua', 
        'pl': 'https://healthpsy.info/pl',
        'de': 'https://healthpsy.info/de',
      },
    },
  };
}

export default async function HomePage(props: Props) {
  const params = await props.params;
  const lang = params.lang || "en";
  
  // Получаем централизованный словарь для серверного рендеринга
  const dictionary = await getDictionary(lang as any);
  const t = dictionary.home; // Вытаскиваем секцию "home" из JSON

  let articles = [];
  let errorOccurred = false;

  try {
    articles = await client.fetch(articlesQuery, { lang });
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
              {t.h1}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
              {t.sub}
            </p>
          </div>
        </section>

        {errorOccurred ? (
          <div id="error-state" className="p-10 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-center">
            <p className="text-red-500 font-bold mb-2">{t.err}</p>
            <p className="text-sm text-gray-500">{t.errSub}</p>
          </div>
        ) : (
          <SearchAndFeed initialArticles={articles} lang={lang} minReadLabel={t.minRead} />
        )}

      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===