// C:\Users\Admin\Desktop\psy\psy-front\components\ui\Footer.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Footer() {
  const pathname = usePathname();
  const langMatch = pathname?.split("/")[1];
  const lang = ['ru', 'en', 'ua', 'pl', 'de'].includes(langMatch || "") ? langMatch as string : "ru";

  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    import(`@/dictionaries/${lang}.json`)
      .then((m) => setDict(m.default.footer))
      .catch(() => import(`@/dictionaries/ru.json`).then((m) => setDict(m.default.footer)));
  }, [lang]);

  if (!dict) return null;

  return (
    <footer 
      id="global-footer" 
      className="bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-zinc-800 pt-12 pb-24 md:pb-8 px-4 md:px-8 mt-auto pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center">
        
        <Link href={`/${lang}`} className="text-2xl font-extrabold tracking-tight text-[#111827] dark:text-white mb-6">
          HEALTH<span className="text-blue-600 font-normal">PSY</span>
        </Link>

        <div id="footer-disclaimer" className="max-w-3xl mb-8 p-4 bg-gray-50 dark:bg-zinc-900 rounded-[16px] border border-gray-100 dark:border-zinc-800">
          <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed uppercase tracking-wider font-semibold">
            Disclaimer
          </p>
          <p className="text-sm text-gray-600 dark:text-zinc-300 mt-2 leading-relaxed">
            {dict.disclaimer}
          </p>
        </div>

        <nav id="footer-links" className="flex flex-wrap justify-center gap-6 mb-8 text-sm font-bold text-gray-500 dark:text-zinc-400">
          <Link href={`/${lang}/about`} className="transition-colors hover:text-gray-900 dark:hover:text-zinc-100">{dict.about}</Link>
          <Link href={`/${lang}/privacy`} className="transition-colors hover:text-gray-900 dark:hover:text-zinc-100">{dict.privacy}</Link>
          <Link href={`/${lang}/terms`} className="transition-colors hover:text-gray-900 dark:hover:text-zinc-100">{dict.terms}</Link>
        </nav>

        <p className="text-xs text-gray-400 dark:text-zinc-500">
          © {new Date().getFullYear()} HealthPsy. {dict.rights}
        </p>
      </div>
    </footer>
  );
}