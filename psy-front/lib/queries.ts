// psy-front/lib/queries.ts
import { groq } from "next-sanity";

// 1. Запрос для ленты и поиска (учитывает язык интерфейса)
export const articlesQuery = groq`*[_type == "post" && language == $lang] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  readTime,
  expert,
  "mainImage": mainImage.asset->url,
  "tags": tags[]->{ 
    "slug": slug.current, 
    "name": coalesce(translations[$lang], title) 
  }
}`;

// 2. Запрос закладок (Ищем просто по ID)
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

// 4. Запрос для страницы результатов поиска (Ищет по title и по тегам)
export const searchArticlesQuery = groq`*[_type == "post" && language == $lang && (
  title match $searchQuery || 
  tags[]->title match $searchQuery || 
  tags[]->translations[$lang] match $searchQuery
)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  "readTime": coalesce(readingTime, readTime),
  "expert": coalesce(expertReview, expert),
  "mainImage": mainImage.asset->url,
  "tags": tags[]->{ 
    "slug": slug.current, 
    "name": coalesce(translations[$lang], title) 
  }
}`;

// 5. Запрос популярных тегов (категорий) для поиска и меню
export const popularTagsQuery = groq`*[_type == "tag" && isFeatured == true] | order(_createdAt asc)[0..5] { 
  "slug": slug.current, 
  "name": coalesce(translations[$lang], title) 
}`;