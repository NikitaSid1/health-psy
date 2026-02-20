// C:\Users\Admin\Desktop\psy\psy-front\components\ui\DesktopMenu.tsx
// === НАЧАЛО БЛОКА: Desktop Categories Menu ===
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { client } from "@/lib/sanity";

// Оставляем только перевод заголовка окна
const menuTranslations = {
  ru: { title: "Популярные темы" },
  en: { title: "Popular Topics" },
  ua: { title: "Популярні теми" },
  pl: { title: "Popularne tematy" },
  de: { title: "Beliebte Themen" },
};

interface DesktopMenuProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

export default function DesktopMenu({ isOpen, onClose, lang }: DesktopMenuProps) {
  const t = menuTranslations[lang as keyof typeof menuTranslations] || menuTranslations.ru;
  
  // Состояние для динамических тегов из Sanity
  const [featuredTags, setFeaturedTags] = useState<{slug: string, name: string}[]>([]);

  // Блокируем скролл страницы
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Загружаем теги при открытии сайта
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const query = `*[_type == "tag" && isFeatured == true] | order(_createdAt asc) { 
          "slug": slug.current, 
          "name": coalesce(translations[$lang], title) 
        }`;
        const data = await client.fetch(query, { lang });
        setFeaturedTags(data);
      } catch (error) {
        console.error("Ошибка загрузки тегов для меню:", error);
      }
    };
    fetchTags();
  }, [lang]);

  return (
    <div id="desktop-menu-wrapper" className="hidden md:block">
      <div 
        id="desktop-menu-overlay"
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-hidden="true"
      />

      <aside
        id="desktop-menu-panel"
        className={`fixed top-0 left-0 bottom-0 z-[70] w-[320px] bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-zinc-800 shadow-2xl dark:shadow-none transform transition-transform duration-500 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div id="desktop-menu-header" className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-zinc-800/50">
          <span className="text-sm font-extrabold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
            {t.title}
          </span>
          <button 
            id="desktop-menu-close-btn"
            onClick={onClose}
            className="p-2 -mr-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        <nav id="desktop-menu-nav" className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
          {featuredTags.length === 0 ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-zinc-800/50 rounded-md w-3/4"></div>
              <div className="h-8 bg-gray-200 dark:bg-zinc-800/50 rounded-md w-1/2"></div>
            </div>
          ) : (
            featuredTags.map((tag) => (
              <Link
                key={tag.slug}
                id={`desktop-menu-link-${tag.slug}`}
                // В будущем можно сделать фильтрацию на странице
                href={`/${lang}?tag=${tag.slug}`}
                onClick={onClose}
                className="group flex items-center justify-between py-3 text-lg font-bold text-[#111827] dark:text-[#f3f4f6] hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
              >
                <span className="tracking-tight">{tag.name}</span>
                <ChevronRight size={18} className="text-gray-300 dark:text-zinc-700 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1 duration-300" />
              </Link>
            ))
          )}
        </nav>

        <div id="desktop-menu-footer" className="p-6 border-t border-gray-100 dark:border-zinc-800/50">
          <Link 
            id="desktop-menu-logo" 
            href={`/${lang}`} 
            onClick={onClose}
            className="text-2xl font-extrabold tracking-tight text-[#111827] dark:text-white"
          >
            HEALTH<span className="text-blue-600 font-normal">PSY</span>
          </Link>
        </div>
      </aside>
    </div>
  );
}
// === КОНЕЦ БЛОКА ===