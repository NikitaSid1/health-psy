"use client"; // Обязательная директива для работы с браузерным API (window, скролл)

import { useEffect, useState } from "react";

export default function ProgressBar() {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      // Насколько мы проскроллили вниз
      const currentScrollY = window.scrollY;
      // Общая высота страницы минус высота окна (то, что реально можно проскроллить)
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      
      if (scrollHeight) {
        setReadingProgress(Number((currentScrollY / scrollHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener("scroll", updateScroll);
    
    // Очищаем слушатель, когда уходим со страницы (хорошая практика)
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    // Контейнер бара: фиксируем в самом верху экрана (top-0) поверх всего (z-50)
    <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-200 dark:bg-zinc-800 z-50">
      {/* Сама полоса прогресса */}
      <div
        className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-150 ease-out"
        style={{ width: `${readingProgress}%` }}
      />
    </div>
  );
}