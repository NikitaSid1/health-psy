// C:\Users\Admin\Desktop\psy\psy-front\app\[lang]\search\page.tsx
// === НАЧАЛО БЛОКА: Search Page ===
import SearchClient from "@/components/search/SearchClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search | HealthPsy",
  description: "Search for psychological articles and topics.",
};

interface Props {
  params: Promise<{ lang: string }>;
}

const pageTranslations = {
  ru: { title: "Поиск" },
  en: { title: "Search" },
  ua: { title: "Пошук" },
  pl: { title: "Szukaj" },
  de: { title: "Suche" },
};

export default async function SearchPage(props: Props) {
  // В Next.js 15 params нужно обрабатывать через await
  const params = await props.params;
  const lang = params.lang || "en";
  const t = pageTranslations[lang as keyof typeof pageTranslations] || pageTranslations.en;

  return (
    <main id="search-page-main" className="layout-container space-y-8 pt-4">
      {/* Большой заголовок страницы */}
      <h1 
        id="search-page-title" 
        className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#111827] dark:text-[#f3f4f6]"
      >
        {t.title}
      </h1>
      
      {/* Вызываем рабочий клиентский компонент и пробрасываем язык */}
      <SearchClient lang={lang} />
    </main>
  );
}
// === КОНЕЦ БЛОКА ===