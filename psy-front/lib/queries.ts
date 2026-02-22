import { groq } from "next-sanity";

export const articlesQuery = groq`*[_type == "post" && language == $lang] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  readTime,
  expert,
  "mainImage": mainImage.asset->url,
  "category": category->{ "slug": slug.current, "name": coalesce(translations[$lang], title) },
  "tags": tags[]->{ "slug": slug.current, "name": coalesce(translations[$lang], title) }
}`;

export const bookmarkedArticlesQuery = groq`*[_type == "post" && _id in $ids] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  "readTime": coalesce(readingTime, readTime),
  "expert": coalesce(expertReview, expert),
  "mainImage": mainImage.asset->url,
  language,
  "category": category->{ "slug": slug.current, "name": coalesce(translations[$lang], title) }
}`;

export const singlePostQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  body,
  publishedAt,
  author->{name, image},
  language,
  "category": category->{ "slug": slug.current, "name": coalesce(translations[$lang], title) },
  "related": *[_type == "post" && category._ref == ^.category._ref && _id != ^._id][0..2] {
    title,
    "slug": slug.current,
    "mainImage": mainImage.asset->url
  }
}`;

export const searchArticlesQuery = groq`*[_type == "post" && language == $lang && (
  title match $searchQuery || 
  tags[]->title match $searchQuery || 
  tags[]->translations[$lang] match $searchQuery ||
  category->title match $searchQuery ||
  category->translations[$lang] match $searchQuery
)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  "readTime": coalesce(readingTime, readTime),
  "expert": coalesce(expertReview, expert),
  "mainImage": mainImage.asset->url,
  "category": category->{ "slug": slug.current, "name": coalesce(translations[$lang], title) },
  "tags": tags[]->{ "slug": slug.current, "name": coalesce(translations[$lang], title) }
}`;

export const popularTagsQuery = groq`*[_type == "tag" && isFeatured == true] | order(_createdAt asc)[0..5] { 
  "slug": slug.current, 
  "name": coalesce(translations[$lang], title) 
}`;