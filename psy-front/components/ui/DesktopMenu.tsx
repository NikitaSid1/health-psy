// C:\Users\Admin\Desktop\psy\psy-front\components\ui\DesktopMenu.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ChevronRight, Home } from "lucide-react"; 
import { client } from "@/lib/sanity";

interface DesktopMenuProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

export default function DesktopMenu({ isOpen, onClose, lang }: DesktopMenuProps) {
  const [featuredTags, setFeaturedTags] = useState<{slug: string, name: string}[]>([]);
  const [dict, setDict] = useState<any>(null);

  // Подгрузка словаря
  useEffect(() => {
    import(`@/dictionaries/${lang}.json`)
      .then((module) => setDict(module.default.desktopMenu))
      .catch(() => import(`@/dictionaries/ru.json`).then((m) => setDict(m.default.desktopMenu)));
  }, [lang]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

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
        console.error("Ошибка загрузки тегов:", error);
      }
    };
    if (isOpen && featuredTags.length === 0) fetchTags();
  }, [lang, isOpen, featuredTags.length]);

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
          <Link id="desktop-menu-logo" href={`/${lang}`} onClick={onClose} className="text-xl font-extrabold tracking-tight text-[#111827] dark:text-white">
            HEALTH<span className="text-blue-600 font-normal">PSY</span>
          </Link>
          <button 
            id="desktop-menu-close-btn"
            onClick={onClose}
            className="p-2 -mr-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        <div id="desktop-menu-content" className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          <div id="desktop-menu-main-nav">
            <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-4 block">
              {dict?.navTitle || "..."}
            </span>
            <nav className="space-y-1">
              <Link href={`/${lang}`} onClick={onClose} className="group flex items-center gap-4 py-3 text-lg font-bold text-[#111827] dark:text-[#f3f4f6] hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                <Home size={20} className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors" />
                <span>{dict?.home || "..."}</span>
              </Link>
            </nav>
          </div>

          <div id="desktop-menu-tags-nav">
            <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-4 block">
              {dict?.tagsTitle || "..."}
            </span>
            <nav className="space-y-1">
              {featuredTags.length === 0 ? (
                <div className="animate-pulse space-y-4 pt-2">
                  <div className="h-6 bg-gray-200 dark:bg-zinc-800/50 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-zinc-800/50 rounded w-1/2"></div>
                </div>
              ) : (
                featuredTags.map((tag) => (
                  <Link
                    key={tag.slug}
                    id={`desktop-menu-tag-${tag.slug}`}
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
          </div>

        </div>
      </aside>
    </div>
  );
}