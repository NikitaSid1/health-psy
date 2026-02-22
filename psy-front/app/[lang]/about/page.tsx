// C:\Users\Admin\Desktop\psy\psy-front\app\[lang]\about\page.tsx
// === НАЧАЛО БЛОКА: About Page ===
import { Metadata } from "next";

const pageTranslations = {
  ru: { 
    title: "О нас", 
    content: "Добро пожаловать на HealthPsy — ваш надежный путеводитель в мире психологии и самопознания. Мы объединяем научный подход и практические советы экспертов, чтобы помочь вам улучшить качество жизни.",
    conclusion: "Мы верим, что забота о ментальном здоровье не менее важна, чем физическое благополучие."
  },
  en: { 
    title: "About Us", 
    content: "Welcome to HealthPsy — your reliable guide in the world of psychology and self-discovery. We combine a scientific approach and practical expert advice to help you improve your quality of life.",
    conclusion: "We believe that taking care of mental health is just as important as physical well-being."
  },
  ua: { 
    title: "Про нас", 
    content: "Ласкаво просимо на HealthPsy — ваш надійний путівник у світі психології та самопізнання. Ми об'єднуємо науковий підхід та практичні поради експертів, щоб допомогти вам покращити якість життя.",
    conclusion: "Ми віримо, що турбота про ментальне здоров'я не менш важлива, ніж фізичне благополуччя."
  },
  pl: { 
    title: "O nas", 
    content: "Witamy w HealthPsy — Twoim niezawodnym przewodniku po świecie psychologii i samopoznania. Łączymy podejście naukowe i praktyczne porady ekspertów, aby pomóc Ci poprawić jakość życia.",
    conclusion: "Wierzymy, że dbanie o zdrowie psychiczne jest równie ważne jak o dobre samopoczucie fizyczne."
  },
  de: { 
    title: "Über uns", 
    content: "Willkommen bei HealthPsy — Ihrem zuverlässigen Begleiter in der Welt der Psychologie und Selbsterkenntnis. Wir kombinieren einen wissenschaftlichen Ansatz mit praktischen Expertentipps, um Ihre Lebensqualität zu verbessern.",
    conclusion: "Wir glauben, dass die Pflege der psychischen Gesundheit genauso wichtig ist wie das körperliche Wohlbefinden."
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = pageTranslations[lang as keyof typeof pageTranslations] || pageTranslations.en;
  return { title: `${t.title} | HealthPsy` };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = pageTranslations[lang as keyof typeof pageTranslations] || pageTranslations.en;

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