import Link from "next/link";

// === НАЧАЛО БЛОКА: Страница 404 ===
export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center py-16">
      {/* Используем наш глобальный контейнер */}
      <div className="layout-container flex flex-col items-center text-center">
        
        <h1 className="text-8xl md:text-9xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
          404
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-md leading-relaxed font-medium">
          Кажется, вы свернули не туда. Но в психологии нет неправильных путей — есть только новый опыт.
        </p>
        
        {/* Идеальная кнопка из дизайн-системы */}
        <Link href="/" className="btn-primary">
          Вернуться на главную
        </Link>

      </div>
    </main>
  );
}
// === КОНЕЦ БЛОКА ===