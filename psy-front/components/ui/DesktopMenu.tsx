// C:\Users\Admin\Desktop\psy\psy-front\components\ui\DesktopMenu.tsx
// === НАЧАЛО БЛОКА: Desktop Categories Menu ===
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";

// Словари для категорий (согласованы с главной лентой)
const menuTranslations = {
  ru: { title: "Категории", categories: [{ id: "psychology", label: "Психология" }, { id: "anxiety", label: "Тревожность" }, { id: "relationships", label: "Отношения" }, { id: "depression", label: "Депрессия" }, { id: "selfcare", label: "Забота о себе" }] },
  en: { title: "Categories", categories: [{ id: "psychology", label: "Psychology" }, { id: "anxiety", label: "Anxiety" }, { id: "relationships", label: "Relationships" }, { id: "depression", label: "Depression" }, { id: "selfcare", label: "Self-care" }] },
  ua: { title: "Категорії", categories: [{ id: "psychology", label: "Психологія" }, { id: "anxiety", label: "Тривожність" }, { id: "relationships", label: "Стосунки" }, { id: "depression", label: "Депресія" }, { id: "selfcare", label: "Турбота про себе" }] },
  pl: { title: "Kategorie", categories: [{ id: "psychology", label: "Psychologia" }, { id: "anxiety", label: "Niepokój" }, { id: "relationships", label: "Relacje" }, { id: "depression", label: "Depresja" }, { id: "selfcare", label: "Samoopieka" }] },
  de: { title: "Kategorien", categories: [{ id: "psychology", label: "Psychologie" }, { id: "anxiety", label: "Angst" }, { id: "relationships", label: "Beziehungen" }, { id: "depression", label: "Depression" }, { id: "selfcare", label: "Selbstfürsorge" }] },
};

interface DesktopMenuProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

export default function DesktopMenu({ isOpen, onClose, lang }: DesktopMenuProps) {
  const t = menuTranslations[lang as keyof typeof menuTranslations] || menuTranslations.ru;

  // Блокируем скролл страницы, когда меню открыто
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div id="desktop-menu-wrapper" className="hidden md:block">
      {/* Затемнение фона (Оверлей) */}
      <div 
        id="desktop-menu-overlay"
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-hidden="true"
      />

      {/* Сама панель меню (выезжает слева) */}
      <aside
        id="desktop-menu-panel"
        className={`fixed top-0 left-0 bottom-0 z-[70] w-[320px] bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-zinc-800 shadow-2xl dark:shadow-none transform transition-transform duration-500 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Шапка меню */}
        <div id="desktop-menu-header" className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-zinc-800/50">
          <span className="text-sm font-extrabold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
            {t.title}
          </span>
          <button 
            id="desktop-menu-close-btn"
            onClick={onClose}
            className="p-2 -mr-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
            aria-label="Close menu"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* Список категорий */}
        <nav id="desktop-menu-nav" className="flex-1 overflow-y-auto p-6 space-y-2">
          {t.categories.map((category) => (
            <Link
              key={category.id}
              id={`desktop-menu-link-${category.id}`}
              // Позже мы настроим правильный роутинг для категорий, пока ведет на главную с параметром
              href={`/${lang}?category=${category.id}`}
              onClick={onClose}
              className="group flex items-center justify-between py-3 text-lg font-bold text-[#111827] dark:text-[#f3f4f6] hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
            >
              <span className="tracking-tight">{category.label}</span>
              <ChevronRight size={18} className="text-gray-300 dark:text-zinc-700 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1 duration-300" />
            </Link>
          ))}
        </nav>

        {/* Подвал меню (Логотип) */}
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