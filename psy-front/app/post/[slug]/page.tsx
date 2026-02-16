import Link from "next/link";
import ProgressBar from "@/components/ui/ProgressBar";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  // Ждем параметры (обязательно в Next.js 15+)
  const resolvedParams = await params;

  return (
    <main className="min-h-screen pb-24 pt-8 md:pt-16 bg-white dark:bg-black">
      <ProgressBar />
      
      <article className="max-w-4xl mx-auto px-4">
        <nav className="mb-8">
          <Link 
            href="/" 
            className="text-sm font-bold text-zinc-500 hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            ← Назад к статьям
          </Link>
        </nav>

        {/* Заголовок: черный на белом, белый на черном */}
        <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white mb-6 leading-tight">
          Статья: {resolvedParams.slug}
        </h1>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6 font-medium">
            Это тестовая страница статьи. В темной теме этот текст теперь будет светлым.
          </p>
          <p className="text-zinc-500 dark:text-zinc-400">
            Когда мы подключим Sanity CMS, здесь будет выводиться реальный контент и YouTube Shorts!
          </p>
        </div>
      </article>
    </main>
  );
}