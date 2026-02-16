// === НАЧАЛО БЛОКА: Home Search Trigger ===
"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HomeSearchTrigger() {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push('/search')} 
      className="relative w-full cursor-text group"
    >
      <div className="absolute inset-y-0 left-0 flex items-center pl-7 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
        <Search size={20} />
      </div>
      <div className="w-full py-4 pl-14 pr-7 text-lg bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 rounded-full shadow-sm transition-all flex items-center">
        Найти статью, тему или автора...
      </div>
    </div>
  );
}
// === КОНЕЦ БЛОКА ===