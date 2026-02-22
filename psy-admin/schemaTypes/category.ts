import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Категории (Categories)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Системное имя (для вас)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL категории (Slug)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'translations',
      title: 'Переводы категории (Обязательно)',
      type: 'object',
      fields: [
        { name: 'ru', title: 'RU (Русский)', type: 'string' },
        { name: 'en', title: 'EN (English)', type: 'string' },
        { name: 'ua', title: 'UA (Українська)', type: 'string' },
        { name: 'pl', title: 'PL (Polski)', type: 'string' },
        { name: 'de', title: 'DE (Deutsch)', type: 'string' },
      ],
      options: { collapsible: true, collapsed: false }
    }),
    defineField({
      name: 'isFeatured',
      title: 'Показывать в меню фильтров на Главной?',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'title', ru: 'translations.ru', featured: 'isFeatured' },
    prepare({ title, ru, featured }) {
      return {
        title: title,
        subtitle: `${ru || 'Нет RU перевода'} ${featured ? '⭐ Фильтр' : ''}`,
      }
    },
  },
})