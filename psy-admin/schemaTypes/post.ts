import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Статья (Post)',
  type: 'document',
  fields: [
    // --- ОСНОВНЫЕ ПОЛЯ ---
    defineField({
      name: 'language',
      title: '🌐 Язык статьи (Language)',
      type: 'string',
      options: {
        list: [
          { title: '🇷🇺 Русский', value: 'ru' },
          { title: '🇬🇧 English', value: 'en' },
          { title: '🇺🇦 Українська', value: 'ua' },
          { title: '🇵🇱 Polski', value: 'pl' },
          { title: '🇩🇪 Deutsch', value: 'de' }
        ],
        layout: 'dropdown',
      },
      initialValue: 'ru',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'translationId',
      title: '🔗 ID Перевода (Связь статей)',
      description: 'СТРОГО: Введи одинаковое кодовое слово (на латинице без пробелов) для всех языковых версий этой статьи. Например: stop-comparing',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Заголовок',
      type: 'string',
      validation: (Rule) => Rule.required().error('Заголовок обязателен'),
    }),
    defineField({
      name: 'slug',
      title: 'URL статьи (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        // Учим Sanity проверять уникальность слага ТОЛЬКО внутри текущего языка
        isUnique: async (value: string, context: any) => {
          const { document, getClient } = context;
          const client = getClient({ apiVersion: '2024-01-01' });
          const id = document?._id.replace(/^drafts\./, '');
          const language = document?.language || 'ru';

          const params = {
            draft: `drafts.${id}`,
            published: id,
            slug: value,
            language: language,
          };

          // Ищем дубли с таким же слагом и ТАКИМ ЖЕ языком (кроме самой себя)
          const query = `!defined(*[!(_id in [$draft, $published]) && slug.current == $slug && language == $language][0]._id)`;
          return await client.fetch(query, params);
        }
      },
      validation: (Rule) => Rule.required(),
    }),

    // --- МЕДИА И МЕТАДАННЫЕ ---
    defineField({
      name: 'mainImage',
      title: 'Главное изображение',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Дата публикации',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'category',
      title: 'Категория (Тег)',
      type: 'string',
      options: {
        list: [
          { title: 'Тревожность', value: 'anxiety' },
          { title: 'Отношения', value: 'relationships' },
          { title: 'Выгорание', value: 'burnout' },
          { title: 'Самооценка', value: 'self-esteem' },
        ],
      },
    }),
    defineField({
      name: 'readTime',
      title: '⏳ Время чтения (мин)',
      type: 'number',
    }),
    defineField({
      name: 'expert',
      title: '🧠 Проверено экспертом ✅ (E-E-A-T)',
      description: 'Показатель E-E-A-T для доверия пользователей',
      type: 'boolean',
      initialValue: false,
    }),

    // --- КОНТЕНТ ---
    defineField({
      name: 'body',
      title: 'Текст статьи',
      type: 'array',
      // Вместо ссылки на blockContent мы прописываем блоки прямо здесь, 
      // чтобы добавить кастомный YouTube блок из твоего старого фронтенда
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
        {
          type: 'object',
          name: 'youtube',
          title: 'YouTube Video / Shorts',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'Ссылка на видео',
              description: 'Вставьте ссылку на обычное видео или Shorts'
            }
          ]
        }
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      lang: 'language',
      media: 'mainImage',
    },
    prepare(selection) {
      const {title, lang, media} = selection
      const langFlags: Record<string, string> = {
        ru: '🇷🇺', en: '🇬🇧', ua: '🇺🇦', pl: '🇵🇱', de: '🇩🇪'
      }
      return {
        title: title,
        subtitle: lang ? `${langFlags[lang as string] || '🌐'} ${lang.toUpperCase()}` : 'No language',
        media: media,
      }
    },
  },
})