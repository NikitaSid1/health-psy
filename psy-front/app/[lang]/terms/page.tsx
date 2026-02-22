// C:\Users\Admin\Desktop\psy\psy-front\app\[lang]\terms\page.tsx
// === НАЧАЛО БЛОКА: Terms of Service Page ===
import { Metadata } from "next";

const pageTranslations = {
  ru: { title: "Пользовательское соглашение", date: "Последнее обновление: Ноябрь 2023", text: "Используя сайт HealthPsy, вы соглашаетесь с приведенными ниже условиями. Пожалуйста, внимательно ознакомьтесь с ними." },
  en: { title: "Terms of Service", date: "Last updated: November 2023", text: "By using the HealthPsy website, you agree to the terms below. Please read them carefully." },
  ua: { title: "Угода користувача", date: "Останнє оновлення: Листопад 2023", text: "Використовуючи сайт HealthPsy, ви погоджуєтеся з наведеними нижче умовами. Будь ласка, уважно ознайомтеся з ними." },
  pl: { title: "Regulamin", date: "Ostatnia aktualizacja: Listopad 2023", text: "Korzystając z witryny HealthPsy, wyrażasz zgodę na poniższe warunki. Prosimy o uważne zapoznanie się z nimi." },
  de: { title: "Nutzungsbedingungen", date: "Zuletzt aktualisiert: November 2023", text: "Durch die Nutzung der HealthPsy-Website stimmen Sie den unten stehenden Bedingungen zu. Bitte lesen Sie diese sorgfältig durch." },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = pageTranslations[lang as keyof typeof pageTranslations] || pageTranslations.en;
  return { title: `${t.title} | HealthPsy` };
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = pageTranslations[lang as keyof typeof pageTranslations] || pageTranslations.en;

  return (
    <main id="terms-page-main" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black text-[#111827] dark:text-zinc-50 mb-4 tracking-tight">
          {t.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-500 mb-8 font-medium">{t.date}</p>
        <div className="prose prose-base md:prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-zinc-300 leading-relaxed">
          <p>{t.text}</p>
          <h3>Отказ от медицинской ответственности</h3>
          <p>Контент, размещенный на сайте HealthPsy, носит исключительно информационно-образовательный характер и не является заменой профессиональной медицинской, психологической или психиатрической консультации, диагностики или лечения.</p>
          <h3>Интеллектуальная собственность</h3>
          <p>Все материалы, статьи и элементы дизайна являются собственностью проекта HealthPsy. Копирование без указания активной ссылки запрещено.</p>
        </div>
      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===