// === НАЧАЛО БЛОКА: Sanity Queries ===
import { groq } from "next-sanity";

export const articlesQuery = groq`*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  "readTime": readTime,
  "expert": expert,
  "mainImage": mainImage.asset->url
}`;
// === КОНЕЦ БЛОКА ===