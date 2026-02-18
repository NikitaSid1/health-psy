// === НАЧАЛО БЛОКА: Sanity Queries ===
import { groq } from "next-sanity";

// Существующий запрос всех статей (Для ленты и поиска)
// Фильтрует по языку: показывает только статьи текущего языка (или старые RU статьи)
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

// ИСПРАВЛЕННЫЙ ЗАПРОС ЗАКЛАДОК:
// Убрали проверку language == $lang. Теперь закладки показываются ВСЕГДА, независимо от языка интерфейса.
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

// Запрос одного поста (для страницы поста)
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