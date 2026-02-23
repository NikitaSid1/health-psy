// C:\Users\Admin\Desktop\psy\psy-front\app\[lang]\privacy\page.tsx
// === НАЧАЛО БЛОКА: Privacy Policy Page ===
import { Metadata } from "next";
import { getDictionary } from "@/dictionaries/getDictionary";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as any);
  return { title: `${dictionary.privacy.title} | HealthPsy` };
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as any);
  const t = dictionary.privacy;

  return (
    <main id="privacy-page-main" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black text-[#111827] dark:text-zinc-50 mb-4 tracking-tight">
          {t.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-500 mb-8 font-medium">{t.date}</p>
        <div className="prose prose-base md:prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-zinc-300 leading-relaxed">
          <p>{t.text}</p>
          <h3>{t.collectionTitle}</h3>
          <p>{t.collectionText}</p>
          <h3>{t.usageTitle}</h3>
          <p>{t.usageText}</p>
        </div>
      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===