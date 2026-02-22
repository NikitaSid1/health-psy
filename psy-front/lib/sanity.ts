// psy-front/lib/sanity.ts
// === НАЧАЛО БЛОКА: Sanity Client & Image Builder ===
import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url"; // <-- ИСПРАВЛЕНИЕ: Именованный импорт

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "dp2yjc73", // Твой ID
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-02-16", 
  useCdn: false, // Отключаем кэш, как ты и хотел
});

// Настраиваем строитель ссылок на картинки
const builder = createImageUrlBuilder(client);

// Экспортируем функцию, которую ищет компонент картинок
export function urlFor(source: any) {
  return builder.image(source);
}
// === КОНЕЦ БЛОКА ===