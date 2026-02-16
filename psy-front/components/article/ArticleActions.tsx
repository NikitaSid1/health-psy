// === НАЧАЛО БЛОКА: Article Actions (Audio & Share) ===
"use client";

import { useState, useEffect } from "react";
import { triggerHaptic } from "@/lib/haptic";

interface ArticleActionsProps {
  title: string;
  textToRead: string;
}

export default function ArticleActions({ title, textToRead }: ArticleActionsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleShare = async () => {
    triggerHaptic('medium'); 
    
    // 1. Попытка нативного шеринга (требует HTTPS)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: "Рекомендую прочитать эту статью: " + title,
          url: url,
        });
      } catch (error) {
        console.error("Ошибка шаринга:", error);
      }
    } 
    // 2. Фолбэк на буфер обмена (требует HTTPS или localhost)
    else if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(url);
        alert("Ссылка скопирована в буфер обмена!");
      } catch (error) {
        console.error("Ошибка копирования:", error);
      }
    } 
    // 3. Фолбэк для локального тестирования по HTTP (IP-адрес)
    else {
      alert(`Скопируйте ссылку вручную (небезопасное соединение):\n\n${url}`);
    }
  };

  const handleAudio = () => {
    triggerHaptic('light');
    
    if (typeof window !== "undefined" && !window.speechSynthesis) {
      alert("Ваш браузер не поддерживает аудио-чтение.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'ru-RU';
      utterance.rate = 1.1; 
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div id="article-interactive-actions" className="flex flex-col sm:flex-row items-center gap-4 my-10 border-y border-gray-100 dark:border-zinc-800 py-6">
      <button onClick={handleAudio} className="btn-secondary w-full sm:w-1/2">
        {isPlaying ? "⏹ Остановить" : "🎧 Слушать статью"}
      </button>
      <button onClick={handleShare} className="btn-primary w-full sm:w-1/2">
        ↗ Поделиться
      </button>
    </div>
  );
}
// === КОНЕЦ БЛОКА ===