// === НАЧАЛО БЛОКА: Sanity Queries ===
import { groq } from "next-sanity";

// Существующий запрос всех статей (Добавлено условие language == $lang)
export const articlesQuery = groq`*[_type == "post" && language == $lang] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  "readTime": readTime,
  "expert": expert,
  "mainImage": mainImage.asset->url,
  language
}`;

// НОВЫЙ ЗАПРОС: Получить статьи по массиву ID (Добавлено условие language == $lang)
export const bookmarkedArticlesQuery = groq`*[_type == "post" && _id in $ids && language == $lang] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  "readTime": readTime,
  "expert": expert,
  "mainImage": mainImage.asset->url,
  language
}`;
// === КОНЕЦ БЛОКА ===