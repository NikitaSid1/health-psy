import Link from "next/link";
// Если используешь ProgressBar, раскомментируй:
// import ProgressBar from "@/components/ui/ProgressBar";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;

  return (
    <main className="min-h-screen pb-24 pt-8 md:pt-24">
      {/* <ProgressBar /> */}

      <article className="layout-container">
        <nav className="mb-8">
          <Link
            href="/"
            className="text-sm font-bold text-zinc-500 hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            ← Назад к статьям
          </Link>
        </nav>

        {/* Заголовок: делаем его максимально ярким и белым */}
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-zinc-50 mb-6 leading-tight">
          Статья: {resolvedParams.slug}
        </h1>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          {/* Основной текст: делаем его значительно светлее */}
          <p className="text-xl text-gray-700 dark:text-zinc-200 leading-relaxed mb-6 font-medium">
            Это тестовая страница статьи. В темной теме этот текст теперь будет светлым и легко читаемым.
          </p>
          <div className="p-6 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 mt-8">
            <p className="text-gray-500 dark:text-zinc-400 m-0">
              Когда мы подключим Sanity CMS, здесь будет выводиться реальный контент и YouTube Shorts!
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}