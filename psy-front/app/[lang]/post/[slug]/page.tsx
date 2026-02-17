// === НАЧАЛО БЛОКА: Single Post Page ===
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image"; 
import ProgressBar from "@/components/ui/ProgressBar"; 
import ArticleActions from "@/components/article/ArticleActions"; 
import BookmarkButton from "@/components/ui/BookmarkButton";
import { Metadata } from "next";

// Словари для локализации страницы "Не найдено" и футера статьи
const postTranslations = {
  ru: { 
    notFoundTitle: "Статья не найдена", 
    backHome: "Вернуться на главную", 
    backBtn: "← Назад к статьям",
    categoryDefault: "Психология",
    minRead: "мин чтения",
    verified: "Проверено экспертом",
    footerTitle: "Понравился материал?",
    footerText: "Подпишитесь на наши обновления, чтобы не пропустить новые советы экспертов."
  },
  en: { 
    notFoundTitle: "Article not found", 
    backHome: "Back to home", 
    backBtn: "← Back to articles",
    categoryDefault: "Psychology",
    minRead: "min read",
    verified: "Verified by expert",
    footerTitle: "Did you like this article?",
    footerText: "Subscribe to our updates so you don't miss new expert advice."
  },
  ua: { 
    notFoundTitle: "Статтю не знайдено", 
    backHome: "Повернутися на головну", 
    backBtn: "← Назад до статей",
    categoryDefault: "Психологія",
    minRead: "хв читання",
    verified: "Перевірено експертом",
    footerTitle: "Сподобався матеріал?",
    footerText: "Підпишіться на наші оновлення, щоб не пропустити нові поради експертів."
  },
  pl: { 
    notFoundTitle: "Nie znaleziono artykułu", 
    backHome: "Wróć do strony głównej", 
    backBtn: "← Wróć do artykułów",
    categoryDefault: "Psychologia",
    minRead: "min czytania",
    verified: "Sprawdzone przez eksperta",
    footerTitle: "Podobał Ci się materiał?",
    footerText: "Zapisz się na nasze aktualizacje, aby nie przegapić nowych porad ekspertów."
  },
  de: { 
    notFoundTitle: "Artikel nicht gefunden", 
    backHome: "Zurück zur Startseite", 
    backBtn: "← Zurück zu den Artikeln",
    categoryDefault: "Psychologie",
    minRead: "Minuten Lesezeit",
    verified: "Von Experten geprüft",
    footerTitle: "Hat Ihnen der Artikel gefallen?",
    footerText: "Abonnieren Sie unsere Updates, um keine neuen Experten-Tipps zu verpassen."
  },
};

const postQuery = groq`*[_type == "post" && slug.current == $slug && language == $lang][0] {
  _id,
  title,
  body,
  publishedAt,
  category,
  readTime,
  expert,
  "mainImage": mainImage.asset->url,
  "plainText": pt::text(body)
}`;

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await client.fetch(postQuery, { lang, slug });

  // Локализация тайтла метаданных
  const t = postTranslations[lang as keyof typeof postTranslations] || postTranslations.ru;

  if (!post) return { title: t.notFoundTitle };

  return {
    title: `${post.title} | HealthPsy`,
    description: post.plainText?.substring(0, 160) + "...",
    openGraph: {
      title: post.title,
      description: post.plainText?.substring(0, 160) + "...",
      images: post.mainImage ? [post.mainImage] : [],
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.expert ? [post.expert] : [],
    },
  };
}

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
  params: Promise<{ lang: string; slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { lang, slug } = await params;
  const t = postTranslations[lang as keyof typeof postTranslations] || postTranslations.ru;
  const post = await client.fetch(postQuery, { lang, slug });

  if (!post) {
    return (
      <main id="post-not-found" className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 font-sans">{t.notFoundTitle}</h1>
          <Link href={`/${lang}`} className="text-blue-600 hover:underline">{t.backHome}</Link>
        </div>
      </main>
    );
  }

  const textForAudio = post.plainText || post.title;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.mainImage ? [post.mainImage] : [],
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.expert || "Редакция",
    },
    timeRequired: `PT${post.readTime || 5}M`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ProgressBar />
      
      <main id="post-main-content" className="font-sans">
        <article id="post-article" className="layout-container max-w-3xl mx-auto">
          
          <nav id="post-navigation" className="mb-8">
            <Link
              href={`/${lang}`}
              className="text-sm font-bold text-zinc-500 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              {t.backBtn}
            </Link>
          </nav>

          <header id="post-header">
            <h1 id="post-title" className="text-3xl md:text-5xl font-black text-gray-900 dark:text-zinc-50 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between mb-10">
              <div id="post-meta" className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {post.category || t.categoryDefault}
                </span>
                <span className="text-gray-400 dark:text-zinc-500">
                  {post.readTime || 5} {t.minRead}
                </span>
                <time className="text-gray-400 dark:text-zinc-500 hidden sm:inline-block">
                  {new Date(post.publishedAt).toLocaleDateString(lang === "en" ? "en-US" : "ru-RU")}
                </time>
                {post.expert && (
                  <span className="text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                    ✓ <span className="hidden sm:inline-block">{t.verified}</span>
                  </span>
                )}
              </div>

              <div className="shrink-0 pl-4">
                <BookmarkButton articleId={post._id} />
              </div>
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
             <h3 className="text-lg font-bold mb-2">{t.footerTitle}</h3>
             <p className="text-gray-500 dark:text-zinc-400 text-sm">
               {t.footerText}
             </p>
          </footer>

        </article>
      </main>
    </>
  );
}
// === КОНЕЦ БЛОКА ===