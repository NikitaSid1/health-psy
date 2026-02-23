// C:\Users\Admin\Desktop\psy\psy-front\components\search\HomeSearchTrigger.tsx
"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomeSearchTrigger({ lang = "en" }: { lang: string }) {
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    import(`@/dictionaries/${lang}.json`)
      .then((m) => setDict(m.default.homeSearchTrigger))
      .catch(() => import(`@/dictionaries/ru.json`).then((m) => setDict(m.default.homeSearchTrigger)));
  }, [lang]);

  const openGlobalSearch = () => {
    window.dispatchEvent(new Event("open-search"));
  };

  return (
    <div 
      id="home-search-trigger"
      onClick={openGlobalSearch} 
      className="relative w-full cursor-text group"
    >
      <div id="home-search-icon" className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-600 transition-colors">
        <Search size={20} />
      </div>
      <div 
        id="home-search-input-fake" 
        className="w-full py-4 pl-[48px] pr-7 text-[16px] sm:text-[18px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 rounded-full shadow-sm transition-all flex items-center"
      >
        {dict?.placeholder || "..."}
      </div>
    </div>
  );
}