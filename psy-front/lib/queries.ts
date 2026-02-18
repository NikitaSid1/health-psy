// === НАЧАЛО БЛОКА: Sanity Queries ===
import { groq } from "next-sanity";

// 1. Запрос для ленты и поиска (учитывает язык интерфейса)
// Показывает посты текущего языка, либо посты без языка (старые), считая их русскими
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

// 2. ИСПРАВЛЕННЫЙ ЗАПРОС ЗАКЛАДОК
// ВАЖНО: Убрана фильтрация по языку. Ищем просто по ID.
export const bookmarkedArticlesQuery = groq`*[_type == "post" && _id in $ids] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  "readTime": coalesce(readingTime, readTime),
  "expert": coalesce(expertReview, expert),
  "mainImage": mainImage.asset->url,
  language
}`;

// 3. Запрос одного поста
export const singlePostQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  body,
  publishedAt,
  author->{name, image},
  language,
  "related": *[_type == "post" && category._ref == ^.category._ref && _id != ^._id][0..2] {
    title,
    "slug": slug.current,
    "mainImage": mainImage.asset->url
  }
}`;
// === КОНЕЦ БЛОКА ===