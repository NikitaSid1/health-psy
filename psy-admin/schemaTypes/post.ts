// === НАЧАЛО БЛОКА: Sanity Post Schema (Restored & Tabbed) ===
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Статья (Post)',
  type: 'document',
  // 💡 РАЗБИВАЕМ ИНТЕРФЕЙС НА ВКЛАДКИ
  groups: [
    { name: 'content', title: 'Контент', default: true },
    { name: 'seo', title: 'SEO & Meta' },
    { name: 'settings', title: 'Настройки' },
  ],
  fields: [
    // --- ВКЛАДКА: НАСТРОЙКИ ---
    defineField({
      name: 'language',
      title: '🌐 Язык статьи',
      type: 'string',
      readOnly: true,
      hidden: true,
      group: 'settings'
    }),
    defineField({
      name: 'translationId',
      title: 'Translation ID (Group ID)',
      type: 'string',
      description: 'Придумайте одинаковый ID для всех версий одной статьи (например: "anxiety-01"). Это свяжет их переключателем.',
      group: 'settings'
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      group: 'settings'
    }),

    // --- ВКЛАДКА: КОНТЕНТ ---
    defineField({
      name: 'title',
      title: 'Title (Заголовок)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL статьи)',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
        // Строгая проверка уникальности слага для ВСЕХ языков
        isUnique: async (value, context) => {
          const { document, getClient } = context;
          const client = getClient({ apiVersion: '2024-02-16' });
          const id = document?._id.replace(/^drafts\./, '');
          
          const params = {
            draft: `drafts.${id}`,
            published: id,
            slug: value as string,
          };
          
          const query = `!defined(*[!(_id in [$draft, $published]) && slug.current == $slug][0]._id)`;
          return await client.fetch(query, params);
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category (Legacy Tag)',
      type: 'string',
      hidden: false, 
      description: 'Старое текстовое поле категории (для совместимости)',
      group: 'content'
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      group: 'content'
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
      group: 'content'
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: { hotspot: true },
      group: 'content'
    }),
    defineField({
      name: 'youtubeShorts',
      title: 'YouTube Shorts (Мультиязычный)',
      type: 'object',
      group: 'content',
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
      group: 'content'
    }),

    // --- ВКЛАДКА: SEO & META (И E-E-A-T) ---
    defineField({
      name: 'seoTitle',
      title: 'SEO Заголовок (Title)',
      description: 'Оставь пустым, чтобы использовать обычный заголовок. Идеально: 50-60 символов.',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Описание (Meta Description)',
      description: 'Краткое описание для Google и соцсетей (до 160 символов).',
      type: 'text',
      rows: 3,
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Картинка для соцсетей (OG Image)',
      description: 'Специальная картинка для репостов в Telegram/WhatsApp (рекомендуется 1200x630). Если пусто — возьмет главную.',
      type: 'image',
      group: 'seo',
    }),
    defineField({
      name: 'expert',
      title: '🧠 Мнение психолога (E-E-A-T)',
      description: 'Поставь галочку, если статью проверял или писал эксперт',
      type: 'boolean',
      initialValue: false,
      group: 'seo'
    }),
    defineField({
      name: 'expertReview',
      title: '[УСТАРЕЛО] Мнение психолога',
      type: 'boolean',
      hidden: true,
      group: 'seo'
    }),
    defineField({
      name: 'readTime',
      title: '⏳ Время чтения (в минутах)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(60),
      group: 'seo'
    }),
    defineField({
      name: 'readingTime',
      title: '[УСТАРЕЛО] Время чтения',
      type: 'number',
      hidden: true,
      group: 'seo'
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