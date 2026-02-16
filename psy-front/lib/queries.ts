import { groq } from "next-sanity";

export const articlesQuery = groq`*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  "category": categories[0]->title,
  "readTime": readingTime,
  "expert": expertReview,
  "mainImage": mainImage.asset->url
}`;