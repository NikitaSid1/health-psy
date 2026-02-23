// C:\Users\Admin\Desktop\psy\psy-front\app\[lang]\about\page.tsx
// === НАЧАЛО БЛОКА: About Page ===
import { Metadata } from "next";
import { getDictionary } from "@/dictionaries/getDictionary";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as any);
  return { title: `${dictionary.about.title} | HealthPsy` };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as any);
  const t = dictionary.about;

  return (
    <main id="about-page-main" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black text-[#111827] dark:text-zinc-50 mb-8 tracking-tight">
          {t.title}
        </h1>
        <div className="prose prose-base md:prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-zinc-300 leading-relaxed">
          <p>{t.content}</p>
          <p>{t.conclusion}</p>
        </div>
      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===