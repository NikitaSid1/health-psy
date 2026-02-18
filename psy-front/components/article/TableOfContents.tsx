// === НАЧАЛО БЛОКА: Table of Contents ===
"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, List } from "lucide-react";

interface Heading {
  _key: string;
  text: string;
  level: number; // 2 для h2, 3 для h3
  slug: string;
}

export default function TableOfContents({ headings, lang }: { headings: Heading[]; lang: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  // Текст кнопки в зависимости от языка
  const title = {
    ru: "Содержание",
    en: "Table of Contents",
    ua: "Зміст",
    pl: "Spis treści",
    de: "Inhaltsverzeichnis"
  }[lang] || "Content";

  // Подсветка активной секции при скролле
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollTo = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      // Скролл с учетом шапки (offset 100px)
      const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
      setIsOpen(false); // Закрываем меню на мобилке после клика
    }
  };

  return (
    <nav className="mb-8 lg:mb-0">
      {/* MOBILE: Раскрывашка */}
      <div className="lg:hidden border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-900/50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 font-bold text-gray-900 dark:text-white"
        >
          <span className="flex items-center gap-2">
            <List size={18} className="text-blue-600" />
            {title}
          </span>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {isOpen && (
          <div className="border-t border-gray-200 dark:border-zinc-800 p-4 space-y-3 bg-white dark:bg-zinc-900">
            {headings.map((h) => (
              <button
                key={h._key}
                onClick={() => scrollTo(h.slug)}
                className={`block text-left text-sm leading-snug w-full ${
                  h.level === 3 ? "pl-4 text-gray-500" : "font-medium text-gray-800 dark:text-gray-200"
                } hover:text-blue-600 transition-colors`}
              >
                {h.text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DESKTOP: Sticky Sidebar */}
      <div className="hidden lg:block sticky top-24 max-w-[280px]">
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
           <List size={14} /> {title}
        </h4>
        <ul className="space-y-3 relative border-l border-gray-200 dark:border-zinc-800 ml-2">
           {headings.map((h) => (
             <li key={h._key} className={`relative pl-4 ${h.level === 3 ? "ml-4" : ""}`}>
               <button
                 onClick={() => scrollTo(h.slug)}
                 className={`text-left text-sm transition-all duration-300 ${
                   activeId === h.slug
                     ? "text-blue-600 font-bold scale-105 origin-left"
                     : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                 }`}
               >
                 {h.text}
               </button>
               
               {/* Активный маркер слева */}
               {activeId === h.slug && (
                 <div className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-blue-600" />
               )}
             </li>
           ))}
        </ul>
      </div>
    </nav>
  );
}
// === КОНЕЦ БЛОКА ===