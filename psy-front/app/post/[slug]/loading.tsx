// === НАЧАЛО БЛОКА: Post Page Loading Skeleton ===
export default function Loading() {
  return (
    <main id="post-skeleton" className="animate-pulse">
      <article className="layout-container max-w-3xl mx-auto space-y-8">
        
        {/* Хлебные крошки */}
        <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded-md mb-8"></div>
        
        {/* Заголовок */}
        <div className="space-y-3 mb-6">
          <div className="h-10 md:h-12 w-full bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
          <div className="h-10 md:h-12 w-4/5 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
        </div>

        {/* Мета-теги */}
        <div className="flex gap-4 mb-10">
          <div className="h-6 w-24 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
        </div>

        {/* Главная картинка */}
        <div className="w-full aspect-video rounded-3xl bg-gray-200 dark:bg-zinc-800 mb-12"></div>

        {/* Текст (имитация абзацев) */}
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="h-4 w-11/12 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
          <br />
          <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="h-4 w-4/5 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
        </div>

      </article>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===