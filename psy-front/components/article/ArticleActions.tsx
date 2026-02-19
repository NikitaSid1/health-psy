// === НАЧАЛО БЛОКА: Article Actions (Audio & Share) ===
"use client";

import { useState, useEffect, useRef } from "react";
import { triggerHaptic } from "@/lib/haptic";

interface ArticleActionsProps {
  title: string;
  textToRead: string;
  lang?: string;
}

const translations = {
  ru: { listen: "🎧 Слушать статью", stop: "⏹ Остановить", share: "↗ Поделиться", copied: "Ссылка скопирована!", recommend: "Рекомендую прочитать эту статью: ", error: "Ваш браузер не поддерживает аудио-чтение." },
  en: { listen: "🎧 Listen to article", stop: "⏹ Stop", share: "↗ Share", copied: "Link copied!", recommend: "I recommend reading this article: ", error: "Your browser does not support audio reading." },
  ua: { listen: "🎧 Слухати статтю", stop: "⏹ Зупинити", share: "↗ Поділитися", copied: "Посилання скопійовано!", recommend: "Рекомендую прочитати цю статтю: ", error: "Ваш браузер не підтримує аудіо-читання." },
  pl: { listen: "🎧 Posłuchaj artykułu", stop: "⏹ Zatrzymaj", share: "↗ Udostępnij", copied: "Link skopiowany!", recommend: "Polecam przeczytać ten artykuł: ", error: "Twoja przeglądarka nie obsługuje czytania audio." },
  de: { listen: "🎧 Artikel anhören", stop: "⏹ Stoppen", share: "↗ Teilen", copied: "Link kopiert!", recommend: "Ich empfehle diesen Artikel zu lesen: ", error: "Ihr Browser unterstützt kein Audio-Lesen." },
};

export default function ArticleActions({ title, textToRead, lang = "ru" }: ArticleActionsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [url, setUrl] = useState("");
  const isComponentMounted = useRef(true);
  
  const t = translations[lang as keyof typeof translations] || translations.ru;

  useEffect(() => {
    setUrl(window.location.href);
    isComponentMounted.current = true;
    
    // Предзагружаем голоса, чтобы избежать паузы при первом клике
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
    
    // Гарантированная остановка при выходе со страницы
    return () => {
      isComponentMounted.current = false;
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleShare = async () => {
    triggerHaptic('medium'); 
    
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: t.recommend + title,
          url: url,
        });
      } catch (error) {
        console.error("Ошибка шаринга:", error);
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(url);
        alert(t.copied);
      } catch (error) {
        console.error("Ошибка копирования:", error);
      }
    } else {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        alert(t.copied);
      } catch (error) {
        alert(`Скопируйте ссылку вручную:\n\n${url}`);
      }
    }
  };

  const handleAudio = () => {
    triggerHaptic('light');
    
    if (typeof window !== "undefined" && !window.speechSynthesis) {
      alert(t.error);
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Сначала всегда вызываем cancel, чтобы сбросить зависшие очереди браузера
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(textToRead);
      
      // Устанавливаем язык
      const langCode = lang === 'ua' ? 'uk-UA' : lang === 'pl' ? 'pl-PL' : lang === 'de' ? 'de-DE' : lang === 'en' ? 'en-US' : 'ru-RU';
      utterance.lang = langCode;
      
      // Поиск лучшего голоса (Google, Microsoft Premium, Natural)
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const matchingVoices = voices.filter(v => v.lang.includes(langCode.split('-')[0]));
        
        const bestVoice = matchingVoices.find(v => 
          v.name.includes("Natural") || 
          v.name.includes("Premium") || 
          v.name.includes("Google") ||
          v.name.includes("Microsoft online")
        );

        if (bestVoice) {
          utterance.voice = bestVoice;
        } else if (matchingVoices.length > 0) {
          utterance.voice = matchingVoices[0];
        }
      }

      utterance.rate = 1.05; // Чуть быстрее для естественности
      
      utterance.onend = () => {
        if (isComponentMounted.current) setIsPlaying(false);
      };
      
      utterance.onerror = () => {
        if (isComponentMounted.current) setIsPlaying(false);
      };
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div id="article-interactive-actions" className="flex flex-col sm:flex-row items-center gap-4 my-10 border-y border-gray-100 dark:border-zinc-800 py-6">
      <button onClick={handleAudio} className="btn-secondary w-full sm:w-1/2">
        {isPlaying ? t.stop : t.listen}
      </button>
      <button onClick={handleShare} className="btn-primary w-full sm:w-1/2">
        {t.share}
      </button>
    </div>
  );
}
// === КОНЕЦ БЛОКА ===