// C:\Users\Admin\Desktop\psy\psy-front\app\[lang]\post\[slug]\page.tsx
// === НАЧАЛО БЛОКА: Single Post Page ===
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image"; 
import ProgressBar from "@/components/ui/ProgressBar"; 
import ArticleActions from "@/components/article/ArticleActions"; 
import BookmarkButton from "@/components/ui/BookmarkButton";
import TableOfContents from "@/components/article/TableOfContents"; 
import { Metadata } from "next";
import TranslationProvider from "./TranslationProvider"; 
import QuizBlock from "@/components/article/QuizBlock";

const postTranslations = {
  ru: { notFoundTitle: "Статья не найдена", backHome: "Вернуться на главную", backBtn: "← Назад к статьям", categoryDefault: "Психология", minRead: "мин чтения", verified: "Проверено экспертом", footerTitle: "Понравился материал?", footerText: "Подпишитесь на наши обновления, чтобы не пропустить новые советы экспертов.", tagsTitle: "Теги:" },
  en: { notFoundTitle: "Article not found", backHome: "Back to home", backBtn: "← Back to articles", categoryDefault: "Psychology", minRead: "min read", verified: "Verified by expert", footerTitle: "Did you like this article?", footerText: "Subscribe to our updates so you don't miss new expert advice.", tagsTitle: "Tags:" },
  ua: { notFoundTitle: "Статтю не знайдено", backHome: "Повернутися на головну", backBtn: "← Назад до статей", categoryDefault: "Психологія", minRead: "хв читання", verified: "Перевірено експертом", footerTitle: "Сподобався матеріал?", footerText: "Підпишіться на наші оновлення, щоб не пропустити нові поради експертів.", tagsTitle: "Теги:" },
  pl: { notFoundTitle: "Nie znaleziono artykułu", backHome: "Wróć do strony głównej", backBtn: "← Wróć do artykułów", categoryDefault: "Psychologia", minRead: "min czytania", verified: "Sprawdzone przez eksperta", footerTitle: "Podobał Ci się materiał?", footerText: "Zapisz się na nasze aktualizacje, aby nie przegapić nowych porad ekspertów.", tagsTitle: "Tagi:" },
  de: { notFoundTitle: "Artikel nicht gefunden", backHome: "Zurück zur Startseite", backBtn: "← Zurück zu den Artikeln", categoryDefault: "Psychologie", minRead: "Minuten Lesezeit", verified: "Von Experten geprüft", footerTitle: "Hat Ihnen der Artikel gefallen?", footerText: "Abonnieren Sie unsere Updates, um keine neuen Experten-Tipps zu verpassen.", tagsTitle: "Tags:" },
};

const postQuery = groq`*[_type == "post" && slug.current == $slug && language == $lang][0] {
  _id,
  title,
  body,
  publishedAt,
  category,
  readTime,
  expert,
  translationId,
  "mainImage": mainImage.asset->url,
  "plainText": pt::text(body),
  "tags": tags[]->{ "slug": slug.current, "name": coalesce(translations[$lang], title) },
  "translations": *[_type == "post" && translationId == ^.translationId] {
    language,
    "slug": slug.current
  }
}`;

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await client.fetch(postQuery, { lang, slug });
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
      const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/)?.[1];
      if (!videoId) return null;
      return (
        <div className="my-10 flex justify-center">
          <div className="w-full overflow-hidden rounded-3xl shadow-xl bg-black aspect-video">
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} title="YouTube" frameBorder="0" allowFullScreen></iframe>
          </div>
        </div>
      );
    },
    youtubeShorts: ({ value }: any) => {
      const { url } = value;
      if (!url) return null;
      const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/)?.[1];
      if (!videoId) return null;
      return (
        <div className="my-10 flex justify-center">
          <div className="w-full overflow-hidden rounded-3xl shadow-xl bg-black max-w-[315px] aspect-[9/16]">
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} title="YouTube Shorts" frameBorder="0" allowFullScreen></iframe>
          </div>
        </div>
      );
    },
    infoBox: ({ value }: any) => {
      const { type, author, text } = value;
      const config = {
        expert: { icon: "🧠", bg: "bg-blue-50 dark:bg-blue-900/10", border: "border-blue-200 dark:border-blue-800", title: "Мнение психолога" },
        warning: { icon: "⚠️", bg: "bg-orange-50 dark:bg-orange-900/10", border: "border-orange-200 dark:border-orange-800", title: "Важно" },
        science: { icon: "🔬", bg: "bg-purple-50 dark:bg-purple-900/10", border: "border-purple-200 dark:border-purple-800", title: "Научный факт" }
      }[type as string] || { icon: "💡", bg: "bg-gray-50 dark:bg-zinc-800", border: "border-gray-200 dark:border-zinc-700", title: "Информация" };

      return (
        <div className={`my-10 p-6 md:p-8 rounded-[24px] border ${config.bg} ${config.border}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl" aria-hidden="true">{config.icon}</span>
            <h4 className="font-bold text-lg md:text-xl text-gray-900 dark:text-white">
              {author ? `${config.title}: ${author}` : config.title}
            </h4>
          </div>
          <p className="text-gray-700 dark:text-zinc-300 italic m-0 text-lg leading-relaxed">
            «{text}»
          </p>
        </div>
      );
    },
    quiz: ({ value }: any) => {
      return <QuizBlock title={value.title} questions={value.questions} />;
    },
  },
  block: {
    normal: ({ children }: any) => <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-zinc-300">{children}</p>,
    h2: ({ children }: any) => <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-12 mb-6 text-gray-900 dark:text-white">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl sm:text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">{children}</h3>,
    blockquote: ({ children }: any) => <blockquote className="border-l-4 border-blue-600 pl-6 py-2 my-8 italic text-xl text-gray-800 dark:text-zinc-200 bg-gray-50 dark:bg-zinc-800/50 rounded-r-xl">{children}</blockquote>,
    ul: ({ children }: any) => <ul className="list-disc pl-6 mb-6 space-y-2 text-lg text-gray-700 dark:text-zinc-300 marker:text-blue-500">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-lg text-gray-700 dark:text-zinc-300 marker:font-bold">{children}</ol>,
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
    author: { "@type": "Person", name: post.expert || "Редакция" },
    timeRequired: `PT${post.readTime || 5}M`,
  };

  const translationMap = post.translations?.reduce((acc: any, curr: any) => {
    if (curr.language && curr.slug) { acc[curr.language] = curr.slug; }
    return acc;
  }, {}) || {};

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProgressBar />
      <TranslationProvider translations={translationMap} currentLang={lang} />
      
      <main id="post-main-content" className="font-sans">
        
        {/* 👇 ИСПРАВЛЕНИЕ 1: Вернул жесткий каркас (w-full max-w-[1440px] px-4), чтобы вёрстка не ломалась 👇 */}
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-center xl:justify-between items-start pt-4 gap-8 lg:gap-12">
          
          {/* 👇 ИСПРАВЛЕНИЕ 2: Пустой блок-распорка. Он нужен, чтобы уравновесить правое меню, тогда статья встанет ИДЕАЛЬНО по центру монитора 👇 */}
          <div className="hidden xl:block w-[280px] shrink-0"></div>

          {/* Центральная колонка (Статья) */}
          <article id="post-article" className="w-full max-w-3xl mx-auto lg:mx-0 xl:mx-auto">
            
            <nav id="post-navigation" className="mb-8">
              <Link href={`/${lang}`} className="text-sm font-bold text-zinc-500 hover:text-blue-600 transition-colors flex items-center gap-2">
                {t.backBtn}
              </Link>
            </nav>

            <header id="post-header">
              <h1 id="post-title" className="text-3xl md:text-5xl font-black text-[#111827] dark:text-zinc-50 mb-6 leading-tight">
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
              <div id="post-hero-image" className="relative w-full aspect-video rounded-[24px] overflow-hidden mb-12 shadow-md dark:shadow-none">
                <Image 
                  src={post.mainImage} 
                  alt={post.title} 
                  fill priority sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            <ArticleActions title={post.title} textToRead={textForAudio} lang={lang} />

            <div className="block lg:hidden w-full mb-8">
              <TableOfContents lang={lang} />
            </div>

            <div 
              id="article-content" 
              className="prose prose-base md:prose-lg dark:prose-invert max-w-none transition-all duration-500 prose-p:text-gray-700 dark:prose-p:text-zinc-200 prose-p:leading-relaxed prose-headings:font-black prose-a:text-blue-600 dark:prose-a:text-blue-400"
            >
              <PortableText value={post.body} components={portableTextComponents} />
            </div>

            {post.tags && post.tags.length > 0 && (
              <div id="post-tags" className="mt-16 pt-8 border-t border-gray-100 dark:border-zinc-800/50">
                <h4 className="text-sm font-extrabold uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-4">
                  {t.tagsTitle}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag: any) => (
                    <Link 
                      key={tag.slug} 
                      href={`/${lang}?tag=${tag.slug}`} 
                      className="bg-gray-100 dark:bg-zinc-800/80 text-gray-600 dark:text-zinc-300 px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <footer id="post-footer" className="p-8 bg-gray-50 dark:bg-zinc-900 rounded-[24px] border border-gray-200 dark:border-zinc-800 mt-12 text-center">
                <h3 className="text-lg font-bold mb-2">{t.footerTitle}</h3>
                <p className="text-gray-500 dark:text-zinc-400 text-sm">
                  {t.footerText}
                </p>
            </footer>

          </article>

          {/* Правая колонка (Боковое меню) */}
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-28">
            <TableOfContents lang={lang} />
          </aside>

        </div>
      </main>
    </>
  );
}
// === КОНЕЦ БЛОКА ===