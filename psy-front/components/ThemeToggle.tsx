"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// === НАЧАЛО БЛОКА: КНОПКА ПЕРЕКЛЮЧЕНИЯ ТЕМЫ ===
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      id="theme-toggle-btn"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      // Добавили "hidden md:flex" в самое начало
      className="hidden md:flex fixed bottom-6 right-6 z-50 p-3 lg:p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 items-center justify-center text-xl"
      aria-label="Переключить тему"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
// === КОНЕЦ БЛОКА ===