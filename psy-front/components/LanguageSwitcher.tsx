// === НАЧАЛО БЛОКА: Smart Language Switcher (Localized) ===
"use client";

import { usePathname, useRouter } from "next/navigation";
import { client } from "@/lib/sanity";
import { useToast } from "@/components/ui/ToastProvider";
import { useState } from "react";

// Словарь сообщений об отсутствии статьи на целевом языке
const NO_ARTICLE_MESSAGES: Record<string, string> = {
  ru: "К сожалению, эта статья недоступна на русском языке.",
  en: "Sorry, this article is not available in English.",
  ua: "На жаль, ця стаття недоступна українською мовою.",
  pl: "Niestety, ten artykuł nie jest dostępny w języku polskim.",
  de: "Leider ist dieser Artikel nicht auf Deutsch verfügbar."
};

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
    { code: "ua", label: "UA" },
    { code: "pl", label: "PL" },
    { code: "de", label: "DE" },
  ];

  const handleLanguageChange = async (targetLangCode: string) => {
    if (!pathname) return;
    
    // Определяем текущий язык из URL (первый сегмент пути)
    const segments = pathname.split("/").filter(Boolean);
    const currentLangCode = languages.some(l => l.code === segments[0]) ? segments[0] : "ru";

    // Если кликнули на тот же язык — ничего не делаем
    if (targetLangCode === currentLangCode) return;

    setIsLoading(true);

    try {
      // 1. ПРОВЕРКА: Находимся ли мы внутри статьи?
      // URL статьи выглядит как /ru/post/some-slug
      const isPostPage = segments.length >= 2 && segments[1] === "post";
      const currentSlug = segments[2]; 

      if (isPostPage && currentSlug) {
        // Запрос в Sanity: есть ли статья с таким slug на новом языке?
        const query = `count(*[_type == "post" && slug.current == $slug && language == $lang])`;
        const exists = await client.fetch(query, { slug: currentSlug, lang: targetLangCode });

        if (exists > 0) {
          // УРА: Статья есть! Переходим.
          router.push(`/${targetLangCode}/post/${currentSlug}`);
        } else {
          // УВЫ: Статьи нет.
          
          // Получаем сообщение на ЦЕЛЕВОМ языке (куда хотели перейти)
          const message = NO_ARTICLE_MESSAGES[targetLangCode] || NO_ARTICLE_MESSAGES.en;
          
          // Показываем уведомление
          showToast(message, "info");
          
          // Перекидываем на главную страницу выбранного языка
          router.push(`/${targetLangCode}`);
        }
      } else {
        // 2. ОБЫЧНАЯ СТРАНИЦА (Главная, Поиск, Закладки) - просто меняем язык в URL
        if (languages.some(l => l.code === segments[0])) {
          segments[0] = targetLangCode;
          router.push(`/${segments.join("/")}`);
        } else {
          // Если URL был корнем, добавляем язык
          router.push(`/${targetLangCode}/${segments.join("/")}`);
        }
      }
    } catch (error) {
      console.error("Ошибка при смене языка:", error);
      // В случае ошибки просто переходим на главную
      router.push(`/${targetLangCode}`);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div 
      id="desktop-lang-switcher" 
      className="hidden md:flex items-center bg-gray-100/80 dark:bg-zinc-800/80 rounded-full p-1 gap-1"
    >
      {languages.map((lang) => {
        const isActive = pathname?.startsWith(`/${lang.code}`);

        return (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            disabled={isLoading}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              isActive
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700"
            } ${isLoading ? "opacity-50 cursor-wait" : ""}`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
// === КОНЕЦ БЛОКА ===