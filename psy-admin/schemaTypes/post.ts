// === НАЧАЛО БЛОКА: Sanity Post Schema Fixed ===
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Статья (Post)',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      title: '🌐 Язык статьи',
      type: 'string',
      readOnly: true, // Плагин интернационализации сам управляет этим полем
    }),
    defineField({
      name: 'title',
      title: 'Заголовок',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL статьи (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      // Мы убрали глючный кастомный isUnique, плагин переводов сам следит за слагами!
      validation: (Rule) => Rule.required(),
    }),
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
    // ВОЗВРАЩАЕМ СТАРЫЕ ИМЕНА ПОЛЕЙ, ЧТОБЫ СПАСТИ СТАРЫЕ СТАТЬИ
    defineField({
      name: 'readingTime',
      title: '⏳ Время чтения (мин)',
      type: 'number',
    }),
    defineField({
      name: 'expertReview',
      title: '🧠 Проверено экспертом ✅ (E-E-A-T)',
      type: 'boolean',
      initialValue: false,
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
      title: 'Текст статьи',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
        {
          type: 'object',
          name: 'youtube',
          title: 'YouTube Video',
          fields: [{ name: 'url', type: 'url', title: 'Ссылка' }]
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
      return {
        title: title,
        subtitle: lang ? `Язык: ${lang.toUpperCase()}` : 'Базовая статья',
        media: media,
      }
    },
  },
})
// === КОНЕЦ БЛОКА ===