import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),

    // === НАЧАЛО БЛОКА: КАСТОМНЫЕ ПОЛЯ ДЛЯ ПСИХОЛОГИИ ===
    defineField({
      name: 'readingTime',
      title: '⏳ Время чтения (в минутах) [Пункт 8]',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(60),
    }),
    defineField({
      name: 'expertReview',
      title: '🧠 Мнение психолога (E-E-A-T) [Пункт 10]',
      description: 'Поставь галочку, если статью проверял или писал эксперт',
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
    // === КОНЕЦ БЛОКА: КАСТОМНЫЕ ПОЛЯ ДЛЯ ПСИХОЛОГИИ ===

    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})