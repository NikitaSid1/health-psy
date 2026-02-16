// === НАЧАЛО БЛОКА: Sanity Queries ===
import { groq } from "next-sanity";

// Существующий запрос всех статей
export const articlesQuery = groq`*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  "readTime": readTime,
  "expert": expert,
  "mainImage": mainImage.asset->url
}`;

// НОВЫЙ ЗАПРОС: Получить статьи по массиву ID (для закладок)
export const bookmarkedArticlesQuery = groq`*[_type == "post" && _id in $ids] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  "readTime": readTime,
  "expert": expert,
  "mainImage": mainImage.asset->url
}`;
// === КОНЕЦ БЛОКА ===