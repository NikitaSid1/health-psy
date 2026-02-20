// C:\Users\Admin\Desktop\psy\psy-admin\schemaTypes\tag.ts
// === НАЧАЛО БЛОКА: Sanity Tag Schema ===
import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export default defineType({
  name: 'tag',
  title: 'Теги (Tags)',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Системное имя тега (для вас)',
      description: 'Например: "Тревожность". Это имя видно только в админке.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL тега (Slug)',
      description: 'Нажми Generate. Будет использоваться в ссылках, например /ru/tag/anxiety',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    
    // Переводы тега для фронтенда
    defineField({
      name: 'translations',
      title: 'Переводы тега (Обязательно)',
      type: 'object',
      fields: [
        { name: 'ru', title: 'RU (Русский)', type: 'string' },
        { name: 'en', title: 'EN (English)', type: 'string' },
        { name: 'ua', title: 'UA (Українська)', type: 'string' },
        { name: 'pl', title: 'PL (Polski)', type: 'string' },
        { name: 'de', title: 'DE (Deutsch)', type: 'string' },
      ],
      options: {
        collapsible: true,
        collapsed: false,
      }
    }),

    // Флаг для отображения тега в главном меню/на главной
    defineField({
      name: 'isFeatured',
      title: 'Показывать в Главном меню и под Поиском?',
      description: 'Включите, чтобы этот тег появился в горизонтальной ленте и Бургер-меню',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      ru: 'translations.ru',
      featured: 'isFeatured'
    },
    prepare(selection) {
      const { title, ru, featured } = selection
      return {
        title: title,
        subtitle: `${ru || 'Нет RU перевода'} ${featured ? '⭐ В меню' : ''}`,
        media: TagIcon,
      }
    },
  },
})
// === КОНЕЦ БЛОКА ===