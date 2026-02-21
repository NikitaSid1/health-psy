// C:\Users\Admin\Desktop\psy\psy-front\components\article\TableOfContents.tsx
// === НАЧАЛО БЛОКА: Table of Contents ===
"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, List } from "lucide-react";

interface Heading {
  _key: string;
  text: string;
  level: number;
  slug: string;
}

export default function TableOfContents({ lang }: { lang: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [headings, setHeadings] = useState<Heading[]>([]);

  const title = {
    ru: "Содержание", en: "Table of Contents", ua: "Зміст", pl: "Spis treści", de: "Inhaltsverzeichnis"
  }[lang] || "Content";

  useEffect(() => {
    // Автоматический сбор заголовков из статьи на клиенте
    const articleContent = document.getElementById("article-content");
    if (!articleContent) return;

    const elements = Array.from(articleContent.querySelectorAll("h2, h3"));
    
    const parsedHeadings = elements.map((el, index) => {
      // Генерируем ID, если его нет (кириллица тоже поддерживается)
      if (!el.id) {
        const generatedId = el.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-а-я]/g, '') || `heading-${index}`;
        el.id = generatedId;
      }
      return {
        _key: el.id,
        text: el.textContent || "",
        level: el.tagName === "H2" ? 2 : 3,
        slug: el.id
      };
    });

    setHeadings(parsedHeadings);

    // Observer для подсветки активного пункта
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  const scrollTo = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
      setIsOpen(false); 
    }
  };

  return (
    <nav className="mb-8 lg:mb-0 w-full">
      {/* MOBILE: Раскрывашка */}
      <div className="lg:hidden border border-gray-200 dark:border-zinc-800 rounded-[24px] overflow-hidden bg-gray-50 dark:bg-zinc-900/50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-5 font-bold text-gray-900 dark:text-white"
        >
          <span className="flex items-center gap-3">
            <List size={20} className="text-blue-600" />
            {title}
          </span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {isOpen && (
          <div className="border-t border-gray-200 dark:border-zinc-800 p-5 space-y-4 bg-white dark:bg-zinc-900">
            {headings.map((h) => (
              <button
                key={h._key}
                onClick={() => scrollTo(h.slug)}
                className={`block text-left text-sm leading-relaxed w-full ${
                  h.level === 3 ? "pl-4 text-gray-500" : "font-extrabold text-gray-800 dark:text-gray-200"
                } hover:text-blue-600 transition-colors`}
              >
                {h.text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DESKTOP: Sticky Sidebar */}
      <div className="hidden lg:block sticky top-28 max-w-[280px]">
        <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
           <List size={16} /> {title}
        </h4>
        <ul className="space-y-4 relative border-l-2 border-gray-100 dark:border-zinc-800 ml-2">
           {headings.map((h) => (
             <li key={h._key} className={`relative pl-5 ${h.level === 3 ? "ml-4" : ""}`}>
               <button
                 onClick={() => scrollTo(h.slug)}
                 className={`text-left text-sm transition-all duration-300 ${
                   activeId === h.slug
                     ? "text-blue-600 font-extrabold"
                     : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white font-medium"
                 }`}
               >
                 {h.text}
               </button>
               
               {/* Активный маркер слева */}
               {activeId === h.slug && (
                 <div className="absolute -left-[2px] top-0 bottom-0 w-[2px] bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
               )}
             </li>
           ))}
        </ul>
      </div>
    </nav>
  );
}
// === КОНЕЦ БЛОКА ===