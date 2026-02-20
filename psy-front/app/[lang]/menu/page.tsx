// C:\Users\Admin\Desktop\psy\psy-front\app\[lang]\menu\page.tsx
// === НАЧАЛО БЛОКА: Страница Меню ===
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { triggerHaptic } from "@/lib/haptic";
import { client } from "@/lib/sanity";
import { ChevronRight } from "lucide-react";

// 1. Создаем словарь интерфейса (без захардкоженных категорий)
const dictionary = {
  ru: {
    title: "Меню",
    settings: "Настройки",
    darkTheme: "Темная тема",
    language: "Язык",
    categories: "Категории",
  },
  en: {
    title: "Menu",
    settings: "Settings",
    darkTheme: "Dark mode",
    language: "Language",
    categories: "Categories",
  },
  ua: {
    title: "Меню",
    settings: "Налаштування",
    darkTheme: "Темна тема",
    language: "Мова",
    categories: "Категорії",
  },
  pl: {
    title: "Menu",
    settings: "Ustawienia",
    darkTheme: "Tryb ciemny",
    language: "Język",
    categories: "Kategorie",
  },
  de: {
    title: "Menü",
    settings: "Einstellungen",
    darkTheme: "Dunkler Modus",
    language: "Sprache",
    categories: "Kategorien",
  }
};

export default function MenuPage() {
  const [mounted, setMounted] = useState(false);
  const [tags, setTags] = useState<{slug: string, name: string}[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  
  const { theme, setTheme, systemTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const currentLang = (pathname?.split("/")[1] || "ru") as keyof typeof dictionary;
  const t = dictionary[currentLang] || dictionary.ru;

  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Асинхронная загрузка тегов из Sanity
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const query = `*[_type == "tag" && isFeatured == true] | order(_createdAt asc) { 
          "slug": slug.current, 
          "name": coalesce(translations[$lang], title) 
        }`;
        const data = await client.fetch(query, { lang: currentLang });
        setTags(data);
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchTags();
  }, [currentLang]);

  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleTheme = () => {
    triggerHaptic('light');
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    triggerHaptic('light');
    const locale = e.target.value;
    
    if (!pathname) {
      router.push(`/${locale}`);
      return;
    }
    
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
    router.refresh();
  };

  return (
    <main id="menu-page" className="pb-24"> {/* pb-24 чтобы нижний бар не перекрывал контент */}
      <div className="layout-container space-y-8 pt-4">
        
        <h1 className="text-4xl md:text-5xl font-black text-[#111827] dark:text-[#f3f4f6] tracking-tight px-2">
          {t.title}
        </h1>

        {/* Настройки */}
        <section id="menu-settings" className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 rounded-[24px] p-6 shadow-sm dark:shadow-none space-y-6">
          <h2 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest">
            {t.settings}
          </h2>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#111827] dark:text-zinc-200">
              {t.darkTheme}
            </span>
            
            {!mounted ? (
              <div className="w-14 h-8 bg-gray-200 dark:bg-zinc-800 rounded-full animate-pulse" />
            ) : (
              <button
                onClick={toggleTheme}
                className={`w-14 h-8 rounded-full relative transition-colors duration-300 focus:outline-none ${
                  currentTheme === "dark" ? "bg-blue-600" : "bg-gray-300 dark:bg-zinc-700"
                }`}
                aria-label="Toggle theme"
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                    currentTheme === "dark" ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            )}
          </div>

          <div className="h-px bg-gray-100 dark:bg-zinc-800/50 w-full" />

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#111827] dark:text-zinc-200">
              {t.language}
            </span>
            <select
              onChange={handleLanguageChange}
              value={currentLang}
              className="bg-gray-50 dark:bg-zinc-900 text-[#111827] dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600 font-bold appearance-none cursor-pointer"
            >
              <option value="ru">Русский (RU)</option>
              <option value="en">English (EN)</option>
              <option value="ua">Українська (UA)</option>
              <option value="pl">Polski (PL)</option>
              <option value="de">Deutsch (DE)</option>
            </select>
          </div>
        </section>

        {/* Категории (динамические) */}
        <section id="menu-categories" className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 rounded-[24px] overflow-hidden shadow-sm dark:shadow-none">
          <div className="p-6 border-b border-gray-100 dark:border-zinc-800/50">
            <h2 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest">
              {t.categories}
            </h2>
          </div>
          
          <nav className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800/50">
            {isLoadingTags ? (
              // Скелетон во время загрузки
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-zinc-800/50 rounded-md w-1/2"></div>
                  <div className="h-5 w-5 bg-gray-200 dark:bg-zinc-800/50 rounded-full"></div>
                </div>
              ))
            ) : tags.length === 0 ? (
              // Если тегов нет
              <div className="p-6 text-center text-gray-500 font-medium">
                Нет доступных категорий
              </div>
            ) : (
              // Вывод тегов
              tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/${currentLang}/tag/${tag.slug}`}
                  className="group flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors active:bg-gray-100 dark:active:bg-zinc-800"
                  onClick={() => triggerHaptic('light')}
                >
                  <span className="text-xl font-bold text-[#111827] dark:text-[#f3f4f6] tracking-tight">
                    {tag.name}
                  </span>
                  <ChevronRight size={20} className="text-gray-300 dark:text-zinc-600 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1 duration-300" />
                </Link>
              ))
            )}
          </nav>
        </section>

      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===