// C:\Users\Admin\Desktop\psy\psy-front\components\search\HomeSearchTrigger.tsx
// === НАЧАЛО БЛОКА: Home Search Trigger ===
"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const translations = {
  ru: { placeholder: "Найти статью, тему или автора..." },
  en: { placeholder: "Search article, topic, or author..." },
  ua: { placeholder: "Знайти статтю, тему або автора..." },
  pl: { placeholder: "Szukaj artykułu, tematu lub autora..." },
  de: { placeholder: "Artikel, Thema oder Autor suchen..." },
};

export default function HomeSearchTrigger({ lang = "en" }: { lang: string }) {
  const router = useRouter();
  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <div 
      id="home-search-trigger"
      // Перенаправляем на страницу поиска с правильным языком!
      onClick={() => router.push(`/${lang}/search`)} 
      className="relative w-full cursor-text group"
    >
      {/* Отступ иконки от края 16px (left-4) */}
      <div id="home-search-icon" className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-600 transition-colors">
        <Search size={20} />
      </div>
      <div 
        id="home-search-input-fake" 
        // py-4 px-7, pl-[48px] (16px край + 20px иконка + 12px от иконки до текста = 48px)
        className="w-full py-4 pl-[48px] pr-7 text-[16px] sm:text-[18px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 rounded-full shadow-sm transition-all flex items-center"
      >
        {t.placeholder}
      </div>
    </div>
  );
}
// === КОНЕЦ БЛОКА ===