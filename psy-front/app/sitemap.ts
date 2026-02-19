// Путь: app/sitemap.ts
import { MetadataRoute } from 'next';
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";

// Укажите ваш главный домен
const baseUrl = 'https://healthpsy.info';
const languages = ['ru', 'ua', 'en', 'pl', 'de'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Запрашиваем ВСЕ статьи из Sanity (только нужные поля для sitemap)
  const query = groq`*[_type == "post" && defined(slug.current) && defined(language)] {
    "slug": slug.current,
    language,
    _updatedAt,
    publishedAt
  }`;

  const posts = await client.fetch(query);

  // 2. Генерируем ссылки для всех динамических статей
  const postUrls = posts.map((post: any) => ({
    url: `${baseUrl}/${post.language}/post/${post.slug}`,
    // Берем дату обновления или публикации, если нет - текущую
    lastModified: post._updatedAt || post.publishedAt || new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 3. Генерируем статические ссылки (Главная, Закладки, Меню) для всех языков
  const staticRoutes = ['', '/bookmarks', '/menu'];
  
  const staticUrls = languages.flatMap((lang) => 
    staticRoutes.map((route) => ({
      url: `${baseUrl}/${lang}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      // Главной странице даем приоритет 1.0, остальным 0.8
      priority: route === '' ? 1.0 : 0.8, 
    }))
  );

  // 4. Объединяем статические страницы и статьи
  return [...staticUrls, ...postUrls];
}