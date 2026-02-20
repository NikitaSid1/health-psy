// C:\Users\Admin\Desktop\psy\psy-front\app\[lang]\loading.tsx
// === НАЧАЛО БЛОКА: Home Page Loading Skeleton ===
export default function Loading() {
  return (
    <main id="home-skeleton" className="animate-pulse">
      <div className="layout-container space-y-10">
        
        {/* Шапка и поиск */}
        <section id="skeleton-hero" className="space-y-6">
          <div className="space-y-3">
            <div className="h-12 w-3/4 md:w-1/2 bg-gray-200 dark:bg-zinc-800/50 rounded-2xl"></div>
            <div className="h-6 w-1/2 md:w-1/3 bg-gray-200 dark:bg-zinc-800/50 rounded-xl"></div>
          </div>
          <div className="h-[56px] w-full max-w-2xl mx-auto bg-gray-200 dark:bg-zinc-800/50 rounded-full"></div>
          <div className="flex gap-3 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-28 shrink-0 bg-gray-200 dark:bg-zinc-800/50 rounded-full"></div>
            ))}
          </div>
        </section>

        {/* Сетка статей (Адаптировано под новый дизайн ArticleCard) */}
        <section id="skeleton-articles" className="space-y-8">
          <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800/50 rounded-xl"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col h-full bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-zinc-800 rounded-[24px] overflow-hidden">
                <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-zinc-800/50"></div>
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex justify-between mb-4">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800/50 rounded-md"></div>
                    <div className="h-6 w-6 bg-gray-200 dark:bg-zinc-800/50 rounded-full"></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-6 w-full bg-gray-200 dark:bg-zinc-800/50 rounded-lg"></div>
                    <div className="h-6 w-4/5 bg-gray-200 dark:bg-zinc-800/50 rounded-lg"></div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-50 dark:border-zinc-800/50">
                    <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-800/50 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===