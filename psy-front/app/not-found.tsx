// === НАЧАЛО БЛОКА: Страница 404 ===
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const notFoundTranslations = {
  ru: {
    message: "Кажется, вы свернули не туда. Но в психологии нет неправильных путей — есть только новый опыт.",
    btnText: "Вернуться на главную"
  },
  en: {
    message: "Looks like you took a wrong turn. But in psychology, there are no wrong paths — only new experiences.",
    btnText: "Back to Home"
  },
  ua: {
    message: "Здається, ви звернули не туди. Але в психології немає неправильних шляхів — є лише новий досвід.",
    btnText: "Повернутися на головну"
  },
  pl: {
    message: "Wygląda na to, że skręciłeś w złą stronę. Ale w psychologii nie ma złych ścieżek — są tylko nowe doświadczenia.",
    btnText: "Wróć do strony głównej"
  },
  de: {
    message: "Sieht so aus, als wären Sie falsch abgebogen. Aber in der Psychologie gibt es keine falschen Wege — nur neue Erfahrungen.",
    btnText: "Zurück zur Startseite"
  }
};

export default function NotFound() {
  const pathname = usePathname();
  
  // Извлекаем код языка из URL (например, 'en' из '/en/something')
  const langMatch = pathname?.split('/')[1];
  const isValidLang = ['ru', 'en', 'ua', 'pl', 'de'].includes(langMatch || "");
  const lang = isValidLang ? (langMatch as keyof typeof notFoundTranslations) : "ru";
  
  const t = notFoundTranslations[lang];

  return (
    <main id="global-not-found" className="min-h-screen flex items-center justify-center py-16">
      <div className="layout-container flex flex-col items-center text-center">
        
        <h1 className="text-8xl md:text-9xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
          404
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-md leading-relaxed font-medium">
          {t.message}
        </p>
        
        <Link href={`/${lang}`} className="btn-primary">
          {t.btnText}
        </Link>

      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===