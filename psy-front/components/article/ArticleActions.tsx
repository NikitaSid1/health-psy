// C:\Users\Admin\Desktop\psy\psy-front\components\article\ArticleActions.tsx
// === НАЧАЛО БЛОКА: Article Actions (Audio, Share, Font) ===
"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { triggerHaptic } from "@/lib/haptic";
import { Type } from "lucide-react"; 

interface ArticleActionsProps {
  title: string;
  textToRead: string;
  lang?: string;
}

export default function ArticleActions({ title, textToRead, lang = "ru" }: ArticleActionsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [url, setUrl] = useState("");
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");
  const isComponentMounted = useRef(true);
  const [dict, setDict] = useState<any>(null);

  const pathname = usePathname();
  const langMatch = pathname?.split("/")[1];
  const currentLang = ['ru', 'en', 'ua', 'pl', 'de'].includes(langMatch || "") ? langMatch : lang;
  
  const isUk = currentLang === 'ua' || currentLang === 'uk';
  const safeLang = isUk ? 'ua' : currentLang;

  useEffect(() => {
    import(`@/dictionaries/${safeLang}.json`)
      .then((m) => setDict(m.default.articleActions))
      .catch(() => import(`@/dictionaries/ru.json`).then((m) => setDict(m.default.articleActions)));
  }, [safeLang]);

  useEffect(() => {
    setUrl(window.location.href);
    isComponentMounted.current = true;
    
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    
    return () => {
      isComponentMounted.current = false;
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleFontSize = () => {
    triggerHaptic('light');
    const article = document.getElementById("article-content");
    if (!article) return;

    article.classList.remove("prose-base", "prose-lg", "prose-xl", "md:prose-lg", "md:prose-xl", "md:prose-2xl");

    if (fontSize === "normal") {
      article.classList.add("prose-lg", "md:prose-xl");
      setFontSize("large");
    } else if (fontSize === "large") {
      article.classList.add("prose-xl", "md:prose-2xl");
      setFontSize("xlarge");
    } else {
      article.classList.add("prose-base", "md:prose-lg");
      setFontSize("normal");
    }
  };

  const handleShare = async () => {
    triggerHaptic('medium'); 
    if (!dict) return;
    
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: dict.recommend + title,
          url: url,
        });
      } catch (error) {
        console.error("Ошибка шаринга:", error);
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(url);
        alert(dict.copied);
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
        alert(dict.copied);
      } catch (error) {
        alert(`${dict.copyManual}${url}`);
      }
    }
  };

  const handleAudio = () => {
    triggerHaptic('light');
    if (!dict) return;

    if (typeof window !== "undefined" && !window.speechSynthesis) {
      alert(dict.error);
      return;
    }
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToRead);
      const langCode = isUk ? 'uk-UA' : safeLang === 'pl' ? 'pl-PL' : safeLang === 'de' ? 'de-DE' : safeLang === 'en' ? 'en-US' : 'ru-RU';
      utterance.lang = langCode;
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const searchLang = langCode.split('-')[0].toLowerCase();
        const matchingVoices = voices.filter(v => v.lang.toLowerCase().includes(searchLang));
        if (matchingVoices.length === 0) {
          alert(dict.noVoice);
          return; 
        }
        const bestVoice = matchingVoices.find(v => 
          v.name.includes("Natural") || v.name.includes("Premium") || v.name.includes("Google") || v.name.includes("Microsoft online") || v.name.includes("Lesya")
        );
        utterance.voice = bestVoice || matchingVoices[0];
      }
      utterance.rate = 1.05; 
      utterance.onend = () => { if (isComponentMounted.current) setIsPlaying(false); };
      utterance.onerror = (e) => { console.error("Ошибка воспроизведения аудио:", e); if (isComponentMounted.current) setIsPlaying(false); };
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div id="article-interactive-actions" className="flex flex-wrap items-center gap-3 my-10 border-y border-gray-100 dark:border-zinc-800 py-6">
      <button onClick={handleAudio} className="btn-secondary flex-1 min-w-[140px] flex justify-center">
        {isPlaying ? (dict?.stop || "Stop") : (dict?.listen || "Listen")}
      </button>
      
      <button 
        onClick={toggleFontSize} 
        className="btn-secondary px-4 flex-shrink-0 flex items-center justify-center"
        aria-label={dict?.font || "Font"}
        title={dict?.font || "Font"}
      >
        <Type size={20} className="text-gray-700 dark:text-gray-300" />
        <span className="ml-1 text-sm font-bold">±</span>
      </button>

      <button onClick={handleShare} className="btn-primary flex-1 min-w-[140px] flex justify-center">
        {dict?.share || "Share"}
      </button>
    </div>
  );
}
// === КОНЕЦ БЛОКА ===