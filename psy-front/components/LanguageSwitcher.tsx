// C:\Users\Admin\Desktop\psy\psy-front\components\LanguageSwitcher.tsx
// === НАЧАЛО БЛОКА: Smart Language Switcher (Dropdown) ===
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { triggerHaptic } from "@/lib/haptic";

const uiDict: Record<string, { article: string, site: string }> = {
  ru: { article: "Эту статью", site: "Весь сайт" },
  en: { article: "This article", site: "Whole site" },
  ua: { article: "Цю статтю", site: "Весь сайт" },
  pl: { article: "Ten artykuł", site: "Cała strona" },
  de: { article: "Dieser Artikel", site: "Ganze Seite" }
};

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [articleTranslations, setArticleTranslations] = useState<Record<string, string> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Слушаем переводы от TranslationProvider
  useEffect(() => {
    const handleTranslations = (e: CustomEvent) => setArticleTranslations(e.detail);
    window.addEventListener('updateArticleTranslations', handleTranslations as EventListener);
    return () => window.removeEventListener('updateArticleTranslations', handleTranslations as EventListener);
  }, []);

  // Закрытие при клике вне меню
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
  const t = uiDict[currentLangCode] || uiDict.ru;

  const handleTranslateSite = (targetLangCode: string) => {
    if (targetLangCode === currentLangCode) return;
    triggerHaptic('light');
    setIsLoading(true);
    setIsOpen(false);
    
    const newSegments = [...segments];
    if (languages.some(l => l.code === newSegments[0])) {
      newSegments[0] = targetLangCode;
    } else {
      newSegments.unshift(targetLangCode);
    }
    
    router.push(`/${newSegments.join("/")}`);
    router.refresh();
  };

  const handleTranslateArticle = (targetLangCode: string, targetSlug: string) => {
    triggerHaptic('light');
    setIsLoading(true);
    setIsOpen(false);
    router.push(`/${targetLangCode}/post/${targetSlug}`);
    router.refresh();
  };

  const availableArticleLangs = languages.filter(l => l.code !== currentLangCode && articleTranslations?.[l.code]);
  const otherSiteLangs = languages.filter(l => l.code !== currentLangCode);

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
          
          {isPostPage && availableArticleLangs.length > 0 && (
            <div className="mb-2">
              <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                {t.article}
              </div>
              {availableArticleLangs.map((lang) => (
                <button
                  key={`article-${lang.code}`}
                  onClick={() => handleTranslateArticle(lang.code, articleTranslations![lang.code])}
                  className="w-full text-left px-3 py-2.5 text-sm font-bold text-[#111827] dark:text-[#f3f4f6] hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-2xl transition-colors"
                >
                  {lang.label} <span className="text-gray-400 ml-1 uppercase text-xs">({lang.code})</span>
                </button>
              ))}
              <div className="h-px w-full bg-gray-100 dark:bg-zinc-800/80 my-2" />
            </div>
          )}

          <div>
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">
              {t.site}
            </div>
            {otherSiteLangs.map((lang) => (
              <button
                key={`site-${lang.code}`}
                onClick={() => handleTranslateSite(lang.code)}
                className="w-full text-left px-3 py-2.5 text-sm font-bold text-[#111827] dark:text-[#f3f4f6] hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-2xl transition-colors"
              >
                {lang.label} <span className="text-gray-400 ml-1 uppercase text-xs">({lang.code})</span>
              </button>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
// === КОНЕЦ БЛОКА ===