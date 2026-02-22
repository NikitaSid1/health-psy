// C:\Users\Admin\Desktop\psy\psy-front\components\marketing\NewsletterPopup.tsx
// === НАЧАЛО БЛОКА: Smart Newsletter Popup ===
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Mail, CheckCircle2 } from "lucide-react";

const popupTranslations = {
  ru: { title: "Не пропустите важное", text: "Подпишитесь на нашу рассылку, чтобы получать лучшие статьи по психологии раз в неделю. Без спама.", placeholder: "Ваш email", btn: "Подписаться", success: "Успешно! Спасибо за подписку.", error: "Произошла ошибка. Попробуйте позже." },
  en: { title: "Don't miss out", text: "Subscribe to our newsletter to receive the best psychology articles once a week. No spam.", placeholder: "Your email", btn: "Subscribe", success: "Success! Thank you for subscribing.", error: "An error occurred. Try again later." },
  ua: { title: "Не пропустіть важливе", text: "Підпишіться на нашу розсилку, щоб отримувати найкращі статті з психології раз на тиждень. Без спаму.", placeholder: "Ваш email", btn: "Підписатися", success: "Успішно! Дякуємо за підписку.", error: "Сталася помилка. Спробуйте пізніше." },
  pl: { title: "Nie przegap", text: "Zapisz się do naszego newslettera, aby co tydzień otrzymywać najlepsze artykuły psychologiczne. Bez spamu.", placeholder: "Twój email", btn: "Subskrybuj", success: "Sukces! Dziękujemy za subskrypcję.", error: "Wystąpił błąd. Spróbuj ponownie później." },
  de: { title: "Verpassen Sie nichts", text: "Abonnieren Sie unseren Newsletter, um einmal pro Woche die besten Psychologie-Artikel zu erhalten. Kein Spam.", placeholder: "Ihre E-Mail", btn: "Abonnieren", success: "Erfolg! Danke für das Abonnement.", error: "Ein Fehler ist aufgetreten. Versuchen Sie es später erneut." },
};

export default function NewsletterPopup() {
  const pathname = usePathname();
  const lang = (pathname?.split("/")[1] || "en") as keyof typeof popupTranslations;
  const t = popupTranslations[lang] || popupTranslations.en;

  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    // Проверяем, показывали ли мы уже попап (флаг в localStorage)
    const isClosed = localStorage.getItem("newsletter_closed");
    if (isClosed === "true") return;

    // Триггер 1: Таймер 30 секунд
    const timer = setTimeout(() => setIsOpen(true), 30000);

    // Триггер 2: Exit Intent (пользователь уводит мышку вверх к вкладкам)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsOpen(true);
        window.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem("newsletter_closed", "true"); // Запоминаем, чтобы не бесить юзера
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(closePopup, 3000); // Закрываем через 3 сек после успеха
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      id="newsletter-popup-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
    >
      <div 
        id="newsletter-popup-content"
        className="relative w-full max-w-md bg-white dark:bg-[#111827] rounded-[24px] shadow-2xl border border-gray-100 dark:border-zinc-800 p-8 pt-10 text-center transform transition-all"
      >
        <button 
          onClick={closePopup}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
          <Mail size={24} />
        </div>

        <h3 className="text-2xl font-extrabold text-[#111827] dark:text-[#f3f4f6] tracking-tight mb-3">
          {t.title}
        </h3>
        <p className="text-gray-500 dark:text-zinc-400 mb-8 leading-relaxed text-sm">
          {t.text}
        </p>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-2 text-green-600 dark:text-green-500 animate-in fade-in">
            <CheckCircle2 size={32} />
            <p className="font-bold">{t.success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.placeholder}
              required
              className="w-full py-4 px-6 text-[16px] bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-[#111827] dark:text-[#f3f4f6] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[16px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "..." : t.btn}
            </button>
            {status === "error" && <p className="text-red-500 text-xs mt-2">{t.error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
// === КОНЕЦ БЛОКА ===