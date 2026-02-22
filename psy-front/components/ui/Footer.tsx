// C:\Users\Admin\Desktop\psy\psy-front\components\ui\Footer.tsx
// === НАЧАЛО БЛОКА: Global Footer ===
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerTranslations = {
  ru: {
    disclaimer: "Вся информация на сайте HealthPsy предоставлена исключительно в образовательных целях и не заменяет профессиональную медицинскую или психиатрическую помощь. Если вы находитесь в кризисной ситуации, обратитесь к специалисту.",
    privacy: "Политика конфиденциальности",
    terms: "Пользовательское соглашение",
    about: "О нас",
    rights: "Все права защищены."
  },
  en: {
    disclaimer: "All information on the HealthPsy website is provided for educational purposes only and is not a substitute for professional medical or psychiatric advice. If you are in a crisis, please seek professional help.",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    about: "About Us",
    rights: "All rights reserved."
  },
  ua: {
    disclaimer: "Вся інформація на сайті HealthPsy надається виключно в освітніх цілях і не замінює професійну медичну або психіатричну допомогу. Якщо ви перебуваєте в кризовій ситуації, зверніться до фахівця.",
    privacy: "Політика конфіденційності",
    terms: "Угода користувача",
    about: "Про нас",
    rights: "Всі права захищені."
  },
  pl: {
    disclaimer: "Wszystkie informacje na stronie HealthPsy są udostępniane wyłącznie w celach edukacyjnych i nie zastępują profesjonalnej porady medycznej ani psychiatrycznej. Jeśli jesteś w kryzysie, skontaktuj się ze specjalistą.",
    privacy: "Polityka prywatności",
    terms: "Regulamin",
    about: "O nas",
    rights: "Wszelkie prawa zastrzeżone."
  },
  de: {
    disclaimer: "Alle Informationen auf der HealthPsy-Website dienen nur zu Bildungszwecken und ersetzen keine professionelle medizinische oder psychiatrische Beratung. Wenn Sie sich in einer Krise befinden, suchen Sie bitte professionelle Hilfe auf.",
    privacy: "Datenschutzerklärung",
    terms: "Nutzungsbedingungen",
    about: "Über uns",
    rights: "Alle Rechte vorbehalten."
  },
};

export default function Footer() {
  const pathname = usePathname();
  const lang = (pathname?.split("/")[1] || "en") as keyof typeof footerTranslations;
  const t = footerTranslations[lang] || footerTranslations.en;

  return (
    <footer 
      id="global-footer" 
      // pb-24 для мобилок из-за BottomBar, pb-8 для ПК. Отступ через safe-area-inset-bottom для челки iPhone.
      className="bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-zinc-800 pt-12 pb-24 md:pb-8 px-4 md:px-8 mt-auto pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center">
        
        {/* Логотип */}
        <Link href={`/${lang}`} className="text-2xl font-extrabold tracking-tight text-[#111827] dark:text-white mb-6">
          HEALTH<span className="text-blue-600 font-normal">PSY</span>
        </Link>

        {/* Disclaimer (Юридическая информация) */}
        <div id="footer-disclaimer" className="max-w-3xl mb-8 p-4 bg-gray-50 dark:bg-zinc-900 rounded-[16px] border border-gray-100 dark:border-zinc-800">
          <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed uppercase tracking-wider font-semibold">
            Disclaimer
          </p>
          <p className="text-sm text-gray-600 dark:text-zinc-300 mt-2 leading-relaxed">
            {t.disclaimer}
          </p>
        </div>

        {/* Ссылки (ИСПРАВЛЕН БАГ: hover перенесен на элементы Link) */}
        <nav id="footer-links" className="flex flex-wrap justify-center gap-6 mb-8 text-sm font-bold text-gray-500 dark:text-zinc-400">
          <Link href={`/${lang}/about`} className="transition-colors hover:text-gray-900 dark:hover:text-zinc-100">{t.about}</Link>
          <Link href={`/${lang}/privacy`} className="transition-colors hover:text-gray-900 dark:hover:text-zinc-100">{t.privacy}</Link>
          <Link href={`/${lang}/terms`} className="transition-colors hover:text-gray-900 dark:hover:text-zinc-100">{t.terms}</Link>
        </nav>

        {/* Копирайт */}
        <p className="text-xs text-gray-400 dark:text-zinc-500">
          © {new Date().getFullYear()} HealthPsy. {t.rights}
        </p>
      </div>
    </footer>
  );
}
// === КОНЕЦ БЛОКА ===