// C:\Users\Admin\Desktop\psy\psy-admin\schemaTypes\post.ts
// === НАЧАЛО БЛОКА: Sanity Post Schema ===
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Статья (Post)',
  type: 'document',
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
    
    // === ИЗМЕНЕНИЕ 1: Заменили translationId на строгую ссылку ===
    defineField({
      name: 'articleGroup',
      title: '🔗 Группа статьи (Связь переводов)',
      type: 'reference',
      to: [{ type: 'articleGroup' }],
      description: 'Выберите группу, чтобы связать все языковые версии этой статьи.',
      group: 'settings',
      validation: (Rule) => Rule.required(),
    }),
    // ===============================================================

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
      title: 'Главная Категория',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Выберите рубрику. По ней будет работать фильтрация на главной.',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'tags',
      title: 'Теги статьи',
      description: 'Выберите теги, которые появятся внизу статьи',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tag' } }],
      options: { layout: 'tags' },
      group: 'seo', 
    }),
    
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }], 
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
      name: 'body',
      title: 'Body (Текст)',
      type: 'blockContent',
      group: 'content'
    }),

    // --- ВКЛАДКА: SEO & META ---
    defineField({
      name: 'seoTitle',
      title: 'SEO Заголовок (Title)',
      description: 'Оставь пустым, чтобы использовать обычный заголовок.',
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
      type: 'image',
      group: 'seo',
    }),
    defineField({
      name: 'expert',
      title: '🧠 Мнение психолога (E-E-A-T)',
      type: 'boolean',
      initialValue: false,
      group: 'seo'
    }),
    defineField({
      name: 'readTime',
      title: '⏳ Время чтения (в минутах)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(60),
      group: 'seo'
    }),
  ],

  // === ИЗМЕНЕНИЕ 2: Улучшаем превью, чтобы было видно группу ===
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      lang: 'language',
      group: 'articleGroup.title' // Подтягиваем название группы
    },
    prepare(selection) {
      const { author, title, media, lang, group } = selection;
      return {
        title: title,
        subtitle: `[${lang ? lang.toUpperCase() : 'RU'}] ${group ? `📂 ${group}` : 'Без группы'}`,
        media: media,
      }
    },
  },
})
// === КОНЕЦ БЛОКА ===