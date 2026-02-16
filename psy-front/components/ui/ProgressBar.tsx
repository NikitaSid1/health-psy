// === НАЧАЛО БЛОКА: Reading Progress Bar ===
"use client";

import { useEffect, useState } from "react";

export default function ProgressBar() {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      
      if (scrollHeight) {
        setReadingProgress(Number((currentScrollY / scrollHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <div id="progress-bar-container" className="fixed top-0 left-0 w-full h-1.5 bg-gray-200 dark:bg-zinc-800 z-50 pointer-events-none">
      <div
        id="progress-bar-fill"
        className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-150 ease-out"
        style={{ width: `${readingProgress}%` }}
      />
    </div>
  );
}
// === КОНЕЦ БЛОКА ===