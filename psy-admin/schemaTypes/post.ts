// === НАЧАЛО БЛОКА: Sanity Post Schema (Final) ===
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Статья (Post)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title (Заголовок)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL статьи)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        // Кастомная проверка: разрешает одинаковые слаги для РАЗНЫХ языков!
        isUnique: async (value, context) => {
          const { document, getClient } = context;
          const client = getClient({ apiVersion: '2024-02-16' });
          const id = document?._id.replace(/^drafts\./, '');
          const lang = document?.language || 'ru';
          
          const params = {
            draft: `drafts.${id}`,
            published: id,
            slug: value as string,
            lang: lang,
          };
          
          const query = `!defined(*[!(_id in [$draft, $published]) && slug.current == $slug && language == $lang][0]._id)`;
          return await client.fetch(query, params);
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: '🌐 Язык статьи',
      type: 'string',
      readOnly: true, // Поле управляется плагином document-internationalization
    }),
    // 👇 ДОБАВЛЕНО: Это поле чинит ошибку "Unknown field... category: anxiety"
    defineField({
      name: 'category',
      title: 'Category (Legacy Tag)',
      type: 'string',
      hidden: false, // Можно скрыть (true), если хочешь редактировать только через Categories (array)
      description: 'Старое текстовое поле категории (для совместимости)',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    
    // --- КАСТОМНЫЕ ПОЛЯ (с защитой старых данных) ---
    defineField({
      name: 'readTime',
      title: '⏳ Время чтения (в минутах)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(60),
    }),
    defineField({
      name: 'readingTime',
      title: '[УСТАРЕЛО] Время чтения',
      type: 'number',
      hidden: true, // Скрываем из админки, но сохраняем в базе
    }),
    defineField({
      name: 'expert',
      title: '🧠 Мнение психолога (E-E-A-T)',
      description: 'Поставь галочку, если статью проверял или писал эксперт',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'expertReview',
      title: '[УСТАРЕЛО] Мнение психолога',
      type: 'boolean',
      hidden: true, // Скрываем из админки, но сохраняем в базе
    }),
    defineField({
      name: 'youtubeShorts',
      title: 'YouTube Shorts (Мультиязычный)',
      type: 'object',
      fields: [
        { name: 'ru', type: 'url', title: 'Видео (RU)' },
        { name: 'en', type: 'url', title: 'Видео (EN)' },
        { name: 'ua', type: 'url', title: 'Видео (UA)' },
        { name: 'pl', type: 'url', title: 'Видео (PL)' },
        { name: 'de', type: 'url', title: 'Видео (DE)' },
      ]
    }),
    defineField({
      name: 'body',
      title: 'Body (Текст)',
      type: 'blockContent',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      lang: 'language',
    },
    prepare(selection) {
      const { author, title, media, lang } = selection;
      return {
        title: title,
        subtitle: `${lang ? lang.toUpperCase() : 'RU'} ${author ? `| by ${author}` : ''}`,
        media: media,
      }
    },
  },
})
// === КОНЕЦ БЛОКА ===