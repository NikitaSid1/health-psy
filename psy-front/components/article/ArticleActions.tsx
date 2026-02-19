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
  ru: { listen: "🎧 Слушать статью", stop: "⏹ Остановить", share: "↗ Поделиться", copied: "Ссылка скопирована!", recommend: "Рекомендую прочитать эту статью: ", error: "Ошибка воспроизведения." },
  en: { listen: "🎧 Listen to article", stop: "⏹ Stop", share: "↗ Share", copied: "Link copied!", recommend: "I recommend reading this article: ", error: "Playback error." },
  ua: { listen: "🎧 Слухати статтю", stop: "⏹ Зупинити", share: "↗ Поділитися", copied: "Посилання скопійовано!", recommend: "Рекомендую прочитати цю статтю: ", error: "Помилка відтворення." },
  pl: { listen: "🎧 Posłuchaj artykułu", stop: "⏹ Zatrzymaj", share: "↗ Udostępnij", copied: "Link skopiowany!", recommend: "Polecam przeczytać ten artykuł: ", error: "Błąd odtwarzania." },
  de: { listen: "🎧 Artikel anhören", stop: "⏹ Stoppen", share: "↗ Teilen", copied: "Link kopiert!", recommend: "Ich empfehle diesen Artikel zu lesen: ", error: "Wiedergabefehler." },
};

export default function ArticleActions({ title, textToRead, lang = "ru" }: ArticleActionsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [url, setUrl] = useState("");
  
  // Используем Refs, чтобы иметь доступ к плееру для его моментальной остановки
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isCancelledRef = useRef<boolean>(false);

  const t = translations[lang as keyof typeof translations] || translations.ru;

  useEffect(() => {
    setUrl(window.location.href);
    
    // 👇 ЭТОТ БЛОК ОСТАНАВЛИВАЕТ ЗВУК ПРИ ВЫХОДЕ СО СТРАНИЦЫ 👇
    return () => {
      isCancelledRef.current = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  const handleShare = async () => {
    triggerHaptic('medium'); 
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title, text: t.recommend + title, url }); } catch (e) {}
    } else if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(url); alert(t.copied); } catch (e) {}
    } else {
      alert(`Скопируйте ссылку вручную:\n\n${url}`);
    }
  };

  // Умная нарезка текста, чтобы не обрывать слова и делать паузы на точках
  const splitTextIntoChunks = (text: string, maxLength = 150) => {
    const cleanText = text.replace(/\s+/g, ' ').trim();
    const sentences = cleanText.match(/[^.!?]+[.!?]*/g) || [cleanText];
    const chunks: string[] = [];

    sentences.forEach(sentence => {
      let currentSentence = sentence.trim();
      if (!currentSentence) return;

      while (currentSentence.length > maxLength) {
        let splitIndex = currentSentence.lastIndexOf(',', maxLength);
        if (splitIndex === -1 || splitIndex === 0) splitIndex = currentSentence.lastIndexOf(' ', maxLength);
        if (splitIndex === -1 || splitIndex === 0) splitIndex = maxLength;

        chunks.push(currentSentence.substring(0, splitIndex).trim());
        currentSentence = currentSentence.substring(splitIndex).trim();
      }
      if (currentSentence) chunks.push(currentSentence);
    });

    // Оптимизируем чанки (объединяем слишком короткие)
    const optimizedChunks: string[] = [];
    let tempChunk = "";
    chunks.forEach(chunk => {
      if ((tempChunk + " " + chunk).trim().length <= maxLength) {
        tempChunk = (tempChunk + " " + chunk).trim();
      } else {
        if (tempChunk) optimizedChunks.push(tempChunk);
        tempChunk = chunk;
      }
    });
    if (tempChunk) optimizedChunks.push(tempChunk);

    return optimizedChunks;
  };

  // Рекурсивное проигрывание очереди фрагментов
  const playQueue = async (urls: string[], index: number) => {
    // Если список закончился или пользователь нажал "Стоп"/Вышел со страницы
    if (index >= urls.length || isCancelledRef.current) {
      setIsPlaying(false);
      return;
    }

    const audio = new Audio(urls[index]);
    audioRef.current = audio;

    // Как только заканчивается один фрагмент, мгновенно запускаем следующий
    audio.onended = () => {
      playQueue(urls, index + 1);
    };

    audio.onerror = () => {
      console.error("Ошибка загрузки куска аудио, пропускаем...");
      playQueue(urls, index + 1);
    };

    try {
      await audio.play();
    } catch (error) {
      console.error("Audio playback error", error);
      setIsPlaying(false);
    }
  };

  const handleAudio = () => {
    triggerHaptic('light');

    if (isPlaying) {
      // Логика Остановки вручную
      isCancelledRef.current = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    isCancelledRef.current = false;
    setIsPlaying(true);

    const chunks = splitTextIntoChunks(textToRead, 150);
    
    // Маппинг языков (Google использует 'uk' для украинского)
    const langCode = lang === 'ua' ? 'uk' : lang === 'en' ? 'en-US' : lang;
    
    // Генерируем URL-адреса для каждого кусочка текста через нейро-мост
    const urls = chunks.map(chunk =>
      `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodeURIComponent(chunk)}`
    );

    // Начинаем проигрывать с нулевого индекса
    playQueue(urls, 0);
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