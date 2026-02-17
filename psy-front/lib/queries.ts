// === НАЧАЛО БЛОКА: Sanity Queries ===
import { groq } from "next-sanity";

// Существующий запрос всех статей (Обновлен для поддержки старых постов)
export const articlesQuery = groq`*[_type == "post" && (language == $lang || (!defined(language) && $lang == 'ru'))] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  "readTime": coalesce(readingTime, readTime),
  "expert": coalesce(expertReview, expert),
  "mainImage": mainImage.asset->url,
  language
}`;

// Запрос для закладок: Получить статьи по массиву ID (Обновлен для поддержки старых постов)
export const bookmarkedArticlesQuery = groq`*[_type == "post" && _id in $ids && (language == $lang || (!defined(language) && $lang == 'ru'))] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  "readTime": coalesce(readingTime, readTime),
  "expert": coalesce(expertReview, expert),
  "mainImage": mainImage.asset->url,
  language
}`;
// === КОНЕЦ БЛОКА ===