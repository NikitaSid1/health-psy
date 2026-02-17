// === НАЧАЛО БЛОКА: Страница Меню ===
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { triggerHaptic } from "@/lib/haptic";

// 1. Создаем словарь интерфейса
const dictionary = {
  ru: {
    title: "Меню",
    settings: "Настройки",
    darkTheme: "Темная тема",
    language: "Язык",
    categories: "Категории",
    catList: ["Отношения", "Выгорание", "Самооценка", "Карьера"]
  },
  en: {
    title: "Menu",
    settings: "Settings",
    darkTheme: "Dark mode",
    language: "Language",
    categories: "Categories",
    catList: ["Relationships", "Burnout", "Self-esteem", "Career"]
  },
  ua: {
    title: "Меню",
    settings: "Налаштування",
    darkTheme: "Темна тема",
    language: "Мова",
    categories: "Категорії",
    catList: ["Відносини", "Вигорання", "Самооцінка", "Кар'єра"]
  },
  pl: {
    title: "Menu",
    settings: "Ustawienia",
    darkTheme: "Tryb ciemny",
    language: "Język",
    categories: "Kategorie",
    catList: ["Relacje", "Wypalenie", "Samoocena", "Kariera"]
  },
  de: {
    title: "Menü",
    settings: "Einstellungen",
    darkTheme: "Dunkler Modus",
    language: "Sprache",
    categories: "Kategorien",
    catList: ["Beziehungen", "Burnout", "Selbstwertgefühl", "Karriere"]
  }
};

export default function MenuPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleTheme = () => {
    triggerHaptic('light');
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  const currentLang = (pathname?.split("/")[1] || "ru") as keyof typeof dictionary;
  
  // 2. Достаем нужные слова из словаря в зависимости от языка
  const t = dictionary[currentLang] || dictionary.ru;

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
    <main id="menu-page">
      <div className="layout-container space-y-8">
        
        {/* Используем словарь для заголовка */}
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-zinc-50 tracking-tight px-2">
          {t.title}
        </h1>

        <section id="menu-settings" className="card-editorial space-y-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            {t.settings}
          </h2>

          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              {t.darkTheme}
            </span>
            
            {!mounted ? (
              <div className="w-14 h-8 bg-gray-200 dark:bg-zinc-700 rounded-full animate-pulse" />
            ) : (
              <button
                onClick={toggleTheme}
                className={`w-14 h-8 rounded-full relative transition-colors duration-300 focus:outline-none ${
                  currentTheme === "dark" ? "bg-blue-600" : "bg-gray-300 dark:bg-zinc-600"
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

          <div className="h-px bg-gray-100 dark:bg-zinc-800 w-full" />

          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              {t.language}
            </span>
            <select
              onChange={handleLanguageChange}
              value={currentLang}
              className="bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium appearance-none cursor-pointer"
            >
              <option value="ru">Русский (RU)</option>
              <option value="en">English (EN)</option>
              <option value="ua">Українська (UA)</option>
              <option value="pl">Polski (PL)</option>
              <option value="de">Deutsch (DE)</option>
            </select>
          </div>
        </section>

        <section id="menu-categories" className="card-editorial space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
            {t.categories}
          </h2>
          <nav className="flex flex-col space-y-5">
            {/* Отрисовываем категории из словаря */}
            {t.catList.map((item, index) => {
              // Для ссылки берем английское название (или слаг), чтобы URL категорий всегда работал,
              // но тут для простоты используем индекс исходного массива или русский ключ, 
              // если у тебя слаги в базе на русском. Пока оставляем генерацию слага как была:
              const slug = dictionary.ru.catList[index].toLowerCase(); 
              return (
                <Link
                  key={item}
                  href={`/${currentLang}/category/${slug}`}
                  className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => triggerHaptic('light')}
                >
                  {item}
                </Link>
              );
            })}
          </nav>
        </section>

      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===