// === НАЧАЛО БЛОКА: Sanity Client & Image Builder ===
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "dp2yjc73", // Твой ID
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-02-16", 
  useCdn: false, // Отключаем кэш, как ты и хотел
});

// Настраиваем строитель ссылок на картинки
const builder = imageUrlBuilder(client);

// Экспортируем функцию, которую ищет компонент картинок
export function urlFor(source: any) {
  return builder.image(source);
}
// === КОНЕЦ БЛОКА ===