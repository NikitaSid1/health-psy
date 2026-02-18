// === НАЧАЛО БЛОКА: Smart Language Switcher ===
"use client";

import { usePathname, useRouter } from "next/navigation";
import { client } from "@/lib/sanity";
import { useToast } from "@/components/ui/ToastProvider";
import { useState } from "react";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast(); // Хук для уведомлений
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { code: "ru", label: "RU", fullName: "Русском" },
    { code: "en", label: "EN", fullName: "Английском" },
    { code: "ua", label: "UA", fullName: "Украинском" },
    { code: "pl", label: "PL", fullName: "Польском" },
    { code: "de", label: "DE", fullName: "Немецком" },
  ];

  const handleLanguageChange = async (targetLangCode: string) => {
    if (!pathname) return;
    
    // Определяем текущий язык из URL (первый сегмент пути)
    const segments = pathname.split("/").filter(Boolean);
    const currentLangCode = languages.some(l => l.code === segments[0]) ? segments[0] : "ru";

    // Если кликнули на тот же язык — ничего не делаем
    if (targetLangCode === currentLangCode) return;

    // Включаем индикатор загрузки (блокируем кнопки)
    setIsLoading(true);

    try {
      // 1. ПРОВЕРКА: Находимся ли мы внутри статьи?
      // URL статьи выглядит как /ru/post/some-slug
      const isPostPage = segments.length >= 2 && segments[1] === "post";
      const currentSlug = segments[2]; // slug статьи

      if (isPostPage && currentSlug) {
        // Делаем запрос в Sanity: есть ли статья с таким же slug, но на новом языке?
        const query = `count(*[_type == "post" && slug.current == $slug && language == $lang])`;
        const exists = await client.fetch(query, { slug: currentSlug, lang: targetLangCode });

        if (exists > 0) {
          // УРА: Статья есть! Переходим на неё.
          router.push(`/${targetLangCode}/post/${currentSlug}`);
        } else {
          // УВЫ: Статьи нет.
          // 1. Получаем полное название языка для красивого сообщения
          const langName = languages.find(l => l.code === targetLangCode)?.fullName || targetLangCode;
          
          // 2. Показываем уведомление (Toast)
          showToast(`К сожалению, этой статьи нет на ${langName} языке.`, "info");
          
          // 3. Перекидываем на главную страницу выбранного языка
          router.push(`/${targetLangCode}`);
        }
      } else {
        // 2. ОБЫЧНАЯ СТРАНИЦА (Главная, Поиск, Закладки)
        // Просто меняем префикс языка в URL.
        // Было: /ru/search -> Стало: /de/search
        if (languages.some(l => l.code === segments[0])) {
          segments[0] = targetLangCode;
          router.push(`/${segments.join("/")}`);
        } else {
          // Если URL был без языка (корень), добавляем язык
          router.push(`/${targetLangCode}/${segments.join("/")}`);
        }
      }
    } catch (error) {
      console.error("Ошибка при смене языка:", error);
      // В случае ошибки просто кидаем на главную выбранного языка
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
            disabled={isLoading} // Блокируем пока идет проверка
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