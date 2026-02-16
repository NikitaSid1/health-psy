// === НАЧАЛО БЛОКА: Страница Меню ===
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { triggerHaptic } from "@/lib/haptic";

export default function MenuPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleTheme = () => {
    triggerHaptic('light');
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <main id="menu-page">
      <div className="layout-container space-y-8">
        
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-zinc-50 tracking-tight px-2">
          Меню
        </h1>

        <section id="menu-settings" className="card-editorial space-y-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Настройки
          </h2>

          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              Темная тема
            </span>
            
            {!mounted ? (
              <div className="w-14 h-8 bg-gray-200 dark:bg-zinc-700 rounded-full animate-pulse" />
            ) : (
              <button
                onClick={toggleTheme}
                className={`w-14 h-8 rounded-full relative transition-colors duration-300 focus:outline-none ${
                  currentTheme === "dark" ? "bg-blue-600" : "bg-gray-300 dark:bg-zinc-600"
                }`}
                aria-label="Переключить тему"
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
              Язык
            </span>
            <select
              onChange={() => triggerHaptic('light')}
              className="bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium appearance-none cursor-pointer"
              defaultValue="RU"
            >
              <option value="RU">Русский (RU)</option>
              <option value="EN">English (EN)</option>
              <option value="UA">Українська (UA)</option>
            </select>
          </div>
        </section>

        <section id="menu-categories" className="card-editorial space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
            Категории
          </h2>
          <nav className="flex flex-col space-y-5">
            {["Отношения", "Выгорание", "Самооценка", "Карьера"].map((item) => (
              <Link
                key={item}
                href={`/category/${item.toLowerCase()}`}
                className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => triggerHaptic('light')}
              >
                {item}
              </Link>
            ))}
          </nav>
        </section>

      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===