// C:\Users\Admin\Desktop\psy\psy-front\app\[lang]\terms\page.tsx
// === НАЧАЛО БЛОКА: Terms of Service Page ===
import { Metadata } from "next";
import { getDictionary } from "@/dictionaries/getDictionary";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as any);
  return { title: `${dictionary.terms.title} | HealthPsy` };
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as any);
  const t = dictionary.terms;

  return (
    <main id="terms-page-main" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black text-[#111827] dark:text-zinc-50 mb-4 tracking-tight">
          {t.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-500 mb-8 font-medium">{t.date}</p>
        <div className="prose prose-base md:prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-zinc-300 leading-relaxed">
          <p>{t.text}</p>
          <h3>{t.disclaimerTitle}</h3>
          <p>{t.disclaimerText}</p>
          <h3>{t.ipTitle}</h3>
          <p>{t.ipText}</p>
        </div>
      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===