// C:\Users\Admin\Desktop\psy\psy-front\app\[lang]\page.tsx
// === НАЧАЛО БЛОКА: Home Page (Strict Lang) ===
import { client } from "@/lib/sanity";
import { articlesQuery } from "@/lib/queries";
import SearchAndFeed from "@/components/feed/SearchAndFeed";
import { Metadata } from "next"; // <-- ДОБАВИЛИ ИМПОРТ

// Кэшируем страницу на 60 секунд
export const revalidate = 60; 

const translations = {
  ru: { 
    h1: "Познай себя.", 
    sub: "#Саморазвитие. #Токсичность #Личные границы #Тревожность", 
    minRead: "мин", 
    err: "Упс! База данных недоступна", 
    errSub: "Проверь настройки Sanity или соединение." 
  },
  en: { 
    h1: "Know yourself.", 
    sub: "#Self-development. #Toxicity #PersonalBoundaries #Anxiety", 
    minRead: "min", 
    err: "Oops! Database unavailable", 
    errSub: "Check Sanity settings or connection." 
  },
  ua: { 
    h1: "Пізнай себе.", 
    sub: "#Саморозвиток. #Токсичність #ОсобистіКордони #Тривожність", 
    minRead: "хв", 
    err: "Упс! База даних недоступна", 
    errSub: "Перевір налаштування Sanity або з'єднання." 
  },
  pl: { 
    h1: "Poznaj siebie.", 
    sub: "#Samorozwój. #Toksyczność #GraniceOsobiste #Niepokój", 
    minRead: "min", 
    err: "Ups! Baza danych niedostępna", 
    errSub: "Sprawdź ustawienia Sanity lub połączenie." 
  },
  de: { 
    h1: "Erkenne dich selbst.", 
    sub: "#Selbstentwicklung. #Toxizität #PersönlicheGrenzen #Angst", 
    minRead: "Min", 
    err: "Hoppla! Datenbank nicht verfügbar", 
    errSub: "Sanity-Einstellungen oder Verbindung prüfen." 
  },
};

interface Props {
  params: Promise<{ lang: string }>;
}

// === НАЧАЛО НОВОГО SEO-БЛОКА ДЛЯ GOOGLE (hreflang) ===
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang || "en";

  return {
    alternates: {
      canonical: `https://healthpsy.info/${lang}`,
      languages: {
        'ru': 'https://healthpsy.info/ru',
        'en': 'https://healthpsy.info/en',
        'uk': 'https://healthpsy.info/ua', // ВАЖНО: для Google украинский язык обозначается как uk
        'pl': 'https://healthpsy.info/pl',
        'de': 'https://healthpsy.info/de',
      },
    },
  };
}
// === КОНЕЦ SEO-БЛОКА ===

export default async function HomePage(props: Props) {
  // В Next.js 15 params нужно ждать (await)
  const params = await props.params;
  
  // Определяем язык (теперь fallback на en, а не на ru)
  const lang = (params.lang || "en") as keyof typeof translations;
  const t = translations[lang] || translations.en;

  let articles = [];
  let errorOccurred = false;

  try {
    // Получаем статьи. В запросе articlesQuery уже есть логика фильтрации по языку.
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
          /* Передаем lang и minReadLabel в SearchAndFeed */
          <SearchAndFeed initialArticles={articles} lang={lang} minReadLabel={t.minRead} />
        )}

      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===