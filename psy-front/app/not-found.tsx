// C:\Users\Admin\Desktop\psy\psy-front\app\not-found.tsx
// === НАЧАЛО БЛОКА: Страница 404 ===
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const pathname = usePathname();
  const [dict, setDict] = useState<any>(null);
  
  // Извлекаем код языка из URL
  const langMatch = pathname?.split('/')[1];
  const isValidLang = ['ru', 'en', 'ua', 'pl', 'de'].includes(langMatch || "");
  const lang = isValidLang ? langMatch : "ru";

  // Динамически подтягиваем нужный JSON словарь на клиенте
  useEffect(() => {
    import(`@/dictionaries/${lang}.json`)
      .then((module) => setDict(module.default.notFound))
      .catch(() => import(`@/dictionaries/ru.json`).then((module) => setDict(module.default.notFound)));
  }, [lang]);

  // Пока словарь загружается, не показываем ничего (чтобы избежать мерцания текста)
  if (!dict) return null;

  return (
    <main id="global-not-found" className="min-h-screen flex items-center justify-center py-16">
      <div className="layout-container flex flex-col items-center text-center">
        
        <h1 className="text-8xl md:text-9xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
          404
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-md leading-relaxed font-medium">
          {dict.message}
        </p>
        
        <Link href={`/${lang}`} className="btn-primary">
          {dict.btnText}
        </Link>

      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===