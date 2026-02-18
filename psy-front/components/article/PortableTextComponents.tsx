// === НАЧАЛО БЛОКА: Custom Portable Text (with IDs) ===
import Image from "next/image";
import { PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity"; // Убедись, что urlFor настроен в lib/sanity

// Функция для создания slug из текста (Привет Мир -> privet-mir)
export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\wа-яё\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

export const ptComponents: PortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <div className="my-8 relative w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800">
           <Image
             src={urlFor(value).url()}
             alt={value.alt || "Article image"}
             width={800}
             height={500}
             className="w-full h-auto object-cover"
             loading="lazy" // Ленивая загрузка по ТЗ
           />
           {value.caption && (
             <div className="text-center text-xs text-gray-500 mt-2 italic">
               {value.caption}
             </div>
           )}
        </div>
      );
    },
  },
  block: {
    // ВАЖНО: Добавляем ID к заголовкам для работы Оглавления
    h2: ({ children, value }: any) => {
      // Пытаемся получить чистый текст из children (React nodes)
      // fallback на случай сложной структуры
      const text = value.children?.[0]?.text || String(children);
      const id = slugify(text);
      return (
        <h2 id={id} className="scroll-mt-24 text-2xl sm:text-3xl font-extrabold tracking-tight mt-12 mb-6 text-gray-900 dark:text-white first:mt-0">
          {children}
        </h2>
      );
    },
    h3: ({ children, value }: any) => {
      const text = value.children?.[0]?.text || String(children);
      const id = slugify(text);
      return (
        <h3 id={id} className="scroll-mt-24 text-xl sm:text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
          {children}
        </h3>
      );
    },
    normal: ({ children }) => (
      <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-600 pl-6 py-2 my-8 italic text-xl text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-zinc-800/50 rounded-r-xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-lg text-gray-700 dark:text-gray-300 marker:text-blue-500">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-lg text-gray-700 dark:text-gray-300 marker:font-bold">{children}</ol>,
  },
};
// === КОНЕЦ БЛОКА ===