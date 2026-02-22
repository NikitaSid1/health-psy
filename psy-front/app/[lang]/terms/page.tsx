// C:\Users\Admin\Desktop\psy\psy-front\app\[lang]\terms\page.tsx
// === НАЧАЛО БЛОКА: Terms of Service Page ===
import { Metadata } from "next";

const pageTranslations = {
  ru: { 
    title: "Пользовательское соглашение", 
    date: "Последнее обновление: Ноябрь 2023", 
    text: "Используя сайт HealthPsy, вы соглашаетесь с приведенными ниже условиями. Пожалуйста, внимательно ознакомьтесь с ними.",
    disclaimerTitle: "Отказ от медицинской ответственности",
    disclaimerText: "Контент, размещенный на сайте HealthPsy, носит исключительно информационно-образовательный характер и не является заменой профессиональной медицинской, психологической или психиатрической консультации, диагностики или лечения.",
    ipTitle: "Интеллектуальная собственность",
    ipText: "Все материалы, статьи и элементы дизайна являются собственностью проекта HealthPsy. Копирование без указания активной ссылки запрещено."
  },
  en: { 
    title: "Terms of Service", 
    date: "Last updated: November 2023", 
    text: "By using the HealthPsy website, you agree to the terms below. Please read them carefully.",
    disclaimerTitle: "Medical Disclaimer",
    disclaimerText: "The content provided on the HealthPsy website is strictly for informational and educational purposes and is not a substitute for professional medical, psychological, or psychiatric advice, diagnosis, or treatment.",
    ipTitle: "Intellectual Property",
    ipText: "All materials, articles, and design elements are the property of the HealthPsy project. Copying without providing an active link is prohibited."
  },
  ua: { 
    title: "Угода користувача", 
    date: "Останнє оновлення: Листопад 2023", 
    text: "Використовуючи сайт HealthPsy, ви погоджуєтеся з наведеними нижче умовами. Будь ласка, уважно ознайомтеся з ними.",
    disclaimerTitle: "Відмова від медичної відповідальності",
    disclaimerText: "Контент, розміщений на сайті HealthPsy, має виключно інформаційно-освітній характер і не замінює професійної медичної, психологічної або психіатричної консультації, діагностики чи лікування.",
    ipTitle: "Інтелектуальна власність",
    ipText: "Всі матеріали, статті та елементи дизайну є власністю проєкту HealthPsy. Копіювання без вказівки активного посилання заборонено."
  },
  pl: { 
    title: "Regulamin", 
    date: "Ostatnia aktualizacja: Listopad 2023", 
    text: "Korzystając z witryny HealthPsy, wyrażasz zgodę na poniższe warunki. Prosimy o uważne zapoznanie się z nimi.",
    disclaimerTitle: "Zrzeczenie się odpowiedzialności medycznej",
    disclaimerText: "Treści zamieszczone na stronie HealthPsy mają wyłącznie charakter informacyjno-edukacyjny i nie zastępują profesjonalnej porady medycznej, psychologicznej ani psychiatrycznej, diagnozy czy leczenia.",
    ipTitle: "Własność intelektualna",
    ipText: "Wszystkie materiały, artykuły i elementy wizualne są własnością projektu HealthPsy. Kopiowanie bez podania aktywnego linku jest zabronione."
  },
  de: { 
    title: "Nutzungsbedingungen", 
    date: "Zuletzt aktualisiert: November 2023", 
    text: "Durch die Nutzung der HealthPsy-Website stimmen Sie den unten stehenden Bedingungen zu. Bitte lesen Sie diese sorgfältig durch.",
    disclaimerTitle: "Medizinischer Haftungsausschluss",
    disclaimerText: "Die auf der HealthPsy-Website bereitgestellten Inhalte dienen ausschließlich Informations- und Bildungszwecken und ersetzen keine professionelle medizinische, psychologische oder psychiatrische Beratung, Diagnose oder Behandlung.",
    ipTitle: "Geistiges Eigentum",
    ipText: "Alle Materialien, Artikel und Designelemente sind Eigentum des HealthPsy-Projekts. Das Kopieren ohne Angabe eines aktiven Links ist untersagt."
  },
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