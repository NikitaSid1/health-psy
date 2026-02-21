// C:\Users\Admin\Desktop\psy\psy-front\components\LanguageSwitcher.tsx
// === НАЧАЛО БЛОКА: Smart Language Switcher (Unified Dropdown) ===
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { triggerHaptic } from "@/lib/haptic";
import { useToast } from "@/components/ui/ToastProvider";

// Твои оригинальные сообщения об отсутствии перевода
const NO_ARTICLE_MESSAGES: Record<string, string> = {
  ru: "К сожалению, эта статья недоступна на выбранном языке. Вы переведены на главную.",
  en: "Sorry, this article is not available in the selected language. Redirected to home.",
  ua: "На жаль, ця стаття недоступна обраною мовою. Вас перенаправлено на головну.",
  pl: "Niestety, ten artykuł nie jest dostępny w wybranym języku. Przekierowano na stronę główną.",
  de: "Leider ist dieser Artikel nicht in der ausgewählten Sprache verfügbar. Zur Startseite weitergeleitet."
};

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [articleTranslations, setArticleTranslations] = useState<Record<string, string> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ИСПРАВЛЕНИЕ ЗАВИСАНИЯ: Сбрасываем loader и закрываем меню, как только изменился URL
  useEffect(() => {
    setIsLoading(false);
    setIsOpen(false);
  }, [pathname]);

  // Слушаем переводы от TranslationProvider (остается без изменений)
  useEffect(() => {
    const handleTranslations = (e: CustomEvent) => setArticleTranslations(e.detail);
    window.addEventListener('updateArticleTranslations', handleTranslations as EventListener);
    return () => window.removeEventListener('updateArticleTranslations', handleTranslations as EventListener);
  }, []);

  // Закрытие при клике вне меню (остается без изменений)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "ru", label: "Русский" },
    { code: "en", label: "English" },
    { code: "ua", label: "Українська" },
    { code: "pl", label: "Polski" },
    { code: "de", label: "Deutsch" },
  ];

  const segments = pathname?.split("/").filter(Boolean) || [];
  const currentLangCode = languages.some(l => l.code === segments[0]) ? segments[0] : "ru";
  const isPostPage = segments.length >= 2 && segments[1] === "post";

  // ЕДИНАЯ УМНАЯ ЛОГИКА ПЕРЕВОДА (Объединение логики статьи и сайта)
  const handleTranslate = (targetLangCode: string) => {
    if (targetLangCode === currentLangCode) return;
    
    triggerHaptic('light');
    setIsLoading(true); // Включаем loader. Выключится он автоматически через useEffect[pathname]
    
    if (isPostPage) {
      // 1. Мы находимся в статье. Проверяем, есть ли перевод:
      if (articleTranslations && articleTranslations[targetLangCode]) {
        // Перевод есть -> идем на переведенную статью
        router.push(`/${targetLangCode}/post/${articleTranslations[targetLangCode]}`);
      } else {
        // Перевода нет -> показываем Toast и кидаем на главную страницу выбранного языка
        const message = NO_ARTICLE_MESSAGES[targetLangCode] || NO_ARTICLE_MESSAGES.en;
        showToast(message, "info");
        router.push(`/${targetLangCode}`);
      }
    } else {
      // 2. Мы НЕ в статье (Главная, Меню, Закладки и т.д.) -> просто меняем язык в URL
      const newSegments = [...segments];
      if (languages.some(l => l.code === newSegments[0])) {
        newSegments[0] = targetLangCode;
      } else {
        newSegments.unshift(targetLangCode);
      }
      router.push(`/${newSegments.join("/")}`);
    }
    
    router.refresh();
  };

  // Оставляем только те языки, которые не являются текущим
  const availableLangs = languages.filter(l => l.code !== currentLangCode);

  return (
    <div id="language-switcher-dropdown" className="relative" ref={dropdownRef}>
      <button
        onClick={() => { triggerHaptic('light'); setIsOpen(!isOpen); }}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors ${
          isOpen ? "bg-gray-100 dark:bg-zinc-800 text-blue-600" : "hover:bg-gray-100 dark:hover:bg-zinc-800 text-[#111827] dark:text-[#f3f4f6]"
        } ${isLoading ? "opacity-50 cursor-wait" : ""}`}
        disabled={isLoading}
      >
        <Globe size={18} />
        <span className="font-bold text-sm uppercase">{currentLangCode}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 shadow-2xl rounded-[24px] p-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Единый компактный список без лишних заголовков и разделений */}
          {availableLangs.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleTranslate(lang.code)}
              className="w-full text-left px-3 py-2.5 text-sm font-bold text-[#111827] dark:text-[#f3f4f6] hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-2xl transition-colors flex justify-between items-center"
            >
              {lang.label} <span className="text-gray-400 uppercase text-[10px]">{lang.code}</span>
            </button>
          ))}

        </div>
      )}
    </div>
  );
}
// === КОНЕЦ БЛОКА ===