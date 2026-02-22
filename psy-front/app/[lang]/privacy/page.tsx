// C:\Users\Admin\Desktop\psy\psy-front\app\[lang]\privacy\page.tsx
// === НАЧАЛО БЛОКА: Privacy Policy Page ===
import { Metadata } from "next";

const pageTranslations = {
  ru: { title: "Политика конфиденциальности", date: "Последнее обновление: Ноябрь 2023", text: "Ваша конфиденциальность очень важна для нас. В этом документе описано, как мы собираем, используем и защищаем ваши личные данные." },
  en: { title: "Privacy Policy", date: "Last updated: November 2023", text: "Your privacy is very important to us. This document describes how we collect, use, and protect your personal data." },
  ua: { title: "Політика конфіденційності", date: "Останнє оновлення: Листопад 2023", text: "Ваша конфіденційність дуже важлива для нас. У цьому документі описано, як ми збираємо, використовуємо та захищаємо ваші особисті дані." },
  pl: { title: "Polityka prywatności", date: "Ostatnia aktualizacja: Listopad 2023", text: "Twoja prywatność jest dla nas bardzo ważna. W tym dokumencie opisano, w jaki sposób zbieramy, wykorzystujemy i chronimy Twoje dane osobowe." },
  de: { title: "Datenschutzerklärung", date: "Zuletzt aktualisiert: November 2023", text: "Ihre Privatsphäre ist uns sehr wichtig. Dieses Dokument beschreibt, wie wir Ihre personenbezogenen Daten erfassen, verwenden und schützen." },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = pageTranslations[lang as keyof typeof pageTranslations] || pageTranslations.en;
  return { title: `${t.title} | HealthPsy` };
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = pageTranslations[lang as keyof typeof pageTranslations] || pageTranslations.en;

  return (
    <main id="privacy-page-main" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black text-[#111827] dark:text-zinc-50 mb-4 tracking-tight">
          {t.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-500 mb-8 font-medium">{t.date}</p>
        <div className="prose prose-base md:prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-zinc-300 leading-relaxed">
          <p>{t.text}</p>
          <h3>Сбор данных</h3>
          <p>Мы собираем только ту информацию, которая необходима для улучшения качества работы сервиса (например, файлы cookie для работы аналитики и сохранения языковых предпочтений).</p>
          <h3>Использование информации</h3>
          <p>Собранные данные не передаются третьим лицам без вашего согласия, за исключением случаев, предусмотренных законодательством.</p>
        </div>
      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===