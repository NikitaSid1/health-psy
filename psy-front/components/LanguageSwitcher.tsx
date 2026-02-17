"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const languages = [
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
    { code: "ua", label: "UA" },
    { code: "pl", label: "PL" },
    { code: "de", label: "DE" },
  ];

  const handleLanguageChange = (locale: string) => {
    if (!pathname) {
      router.push(`/${locale}`);
      return;
    }
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
    router.refresh();
  };

  return (
    // Убрали fixed и top-4. Добавили hidden md:flex (скрыт на мобилках, виден на ПК)
    <div 
      id="desktop-lang-switcher" 
      className="hidden md:flex items-center bg-gray-100/80 dark:bg-zinc-800/80 rounded-full p-1 gap-1"
    >
      {languages.map((lang) => {
        const isActive = pathname?.startsWith(`/${lang.code}`);

        return (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              isActive
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700"
            }`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}