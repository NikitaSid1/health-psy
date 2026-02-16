import Link from "next/link";
import ProgressBar from "@/components/ui/ProgressBar";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  // Ждем параметры (обязательно в Next.js 15+)
  const resolvedParams = await params;

  return (
    <main className="min-h-screen pb-24 pt-8 md:pt-16 bg-background">
      <ProgressBar />
      <article className="layout-container">
        
        <nav className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад к статьям
          </Link>
        </nav>

        <header className="space-y-6 mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            Статья: {resolvedParams.slug}
          </h1>
        </header>

        <div className="prose prose-lg dark:prose-invert prose-blue max-w-none">
          <p className="lead">Это тестовая страница статьи.</p>
          <p>Когда мы подключим Sanity CMS, здесь будет выводиться реальный контент и YouTube Shorts!</p>
        </div>

      </article>
    </main>
  );
}