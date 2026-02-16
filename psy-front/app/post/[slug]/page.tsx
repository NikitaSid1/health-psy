// === НАЧАЛО БЛОКА: Single Post Page ===
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image"; // Оптимизация по п.28
import ProgressBar from "@/components/ui/ProgressBar"; // Индикатор чтения
import ArticleActions from "@/components/article/ArticleActions"; // Интерактив

// Запрос. Добавили plainText для передачи в аудио-читалку
const postQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  title,
  body,
  publishedAt,
  category,
  readTime,
  expert,
  "mainImage": mainImage.asset->url,
  "plainText": pt::text(body)
}`;

const portableTextComponents = {
  types: {
    youtube: ({ value }: any) => {
      const { url } = value;
      if (!url) return null;

      const isShorts = url.includes("shorts/");
      const videoId = isShorts 
        ? url.split("shorts/")[1].split(/[?#]/)[0] 
        : url.split("v=")[1]?.split("&")[0];

      return (
        <div id={`video-${videoId}`} className="my-10 flex justify-center">
          <div className={`w-full overflow-hidden rounded-3xl shadow-2xl bg-black ${
            isShorts ? "max-w-[315px] aspect-[9/16]" : "aspect-video"
          }`}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      );
    },
  },
};

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await client.fetch(postQuery, { slug });

  if (!post) {
    return (
      <main id="post-not-found" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 font-sans">Статья не найдена</h1>
          <Link href="/" className="text-blue-600 hover:underline">Вернуться на главную</Link>
        </div>
      </main>
    );
  }

  // Текст для озвучки
  const textForAudio = post.plainText || post.title;

  return (
    <>
      <ProgressBar />
      
      <main id="post-main-content" className="min-h-screen pb-24 pt-8 md:pt-24 font-sans">
        <article id="post-article" className="layout-container max-w-3xl mx-auto">
          
          <nav id="post-navigation" className="mb-8">
            <Link
              href="/"
              className="text-sm font-bold text-zinc-500 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              ← Назад к статьям
            </Link>
          </nav>

          <header id="post-header">
            <h1 id="post-title" className="text-3xl md:text-5xl font-black text-gray-900 dark:text-zinc-50 mb-6 leading-tight">
              {post.title}
            </h1>

            <div id="post-meta" className="flex flex-wrap items-center gap-4 mb-10 text-sm font-medium">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {post.category || "Психология"}
              </span>
              <span className="text-gray-400 dark:text-zinc-500">
                {post.readTime || 5} мин чтения
              </span>
              <time className="text-gray-400 dark:text-zinc-500">
                {new Date(post.publishedAt).toLocaleDateString("ru-RU")}
              </time>
              {post.expert && (
                <span className="text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                  ✓ Проверено экспертом
                </span>
              )}
            </div>
          </header>

          {post.mainImage && (
            <div id="post-hero-image" className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl">
              <Image 
                src={post.mainImage} 
                alt={post.title} 
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover w-full h-full"
              />
            </div>
          )}

          {/* Интерактивный блок: Слушать и Поделиться */}
          <ArticleActions title={post.title} textToRead={textForAudio} />

          <div id="post-body" className="prose prose-zinc dark:prose-invert max-w-none 
            prose-lg 
            prose-p:text-gray-700 dark:prose-p:text-zinc-200 
            prose-p:leading-relaxed 
            prose-headings:font-black 
            prose-a:text-blue-600 dark:prose-a:text-blue-400">
            
            <PortableText 
              value={post.body} 
              components={portableTextComponents} 
            />
            
          </div>

          <footer id="post-footer" className="p-8 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 mt-16 text-center">
             <h3 className="text-lg font-bold mb-2">Понравился материал?</h3>
             <p className="text-gray-500 dark:text-zinc-400 text-sm">
               Подпишитесь на наши обновления, чтобы не пропустить новые советы экспертов.
             </p>
          </footer>

        </article>
      </main>
    </>
  );
}
// === КОНЕЦ БЛОКА ===