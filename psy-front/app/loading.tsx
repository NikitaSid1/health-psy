// === НАЧАЛО БЛОКА: Home Page Loading Skeleton ===
export default function Loading() {
  return (
    <main id="home-skeleton" className="min-h-screen pb-24 pt-8 md:pt-16 animate-pulse">
      <div className="layout-container space-y-10">
        
        {/* Шапка и поиск */}
        <section id="skeleton-hero" className="space-y-6">
          <div className="space-y-3">
            <div className="h-12 w-3/4 md:w-1/2 bg-gray-200 dark:bg-zinc-800 rounded-2xl"></div>
            <div className="h-6 w-1/2 md:w-1/3 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
          </div>
          <div className="h-14 w-full bg-gray-200 dark:bg-zinc-800 rounded-3xl"></div>
          <div className="flex gap-3 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-28 shrink-0 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
            ))}
          </div>
        </section>

        {/* Сетка статей */}
        <section id="skeleton-articles" className="space-y-8">
          <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card-editorial flex flex-col h-full border border-gray-100 dark:border-zinc-800">
                <div className="w-full h-48 rounded-2xl bg-gray-200 dark:bg-zinc-800 mb-5"></div>
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-zinc-800 rounded-md mb-3"></div>
                <div className="h-6 w-full bg-gray-200 dark:bg-zinc-800 rounded-lg mb-2"></div>
                <div className="h-6 w-4/5 bg-gray-200 dark:bg-zinc-800 rounded-lg mb-4"></div>
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <div className="h-4 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
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