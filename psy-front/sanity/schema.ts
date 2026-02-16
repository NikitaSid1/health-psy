// === НАЧАЛО БЛОКА: Sanity Post Schema ===
export const postSchema = {
  name: 'post',
  title: 'Статья',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Заголовок',
      type: 'string',
      validation: (Rule: any) => Rule.required().error('Заголовок обязателен'),
    },
    {
      name: 'slug',
      title: 'URL статьи (Slug)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Дата публикации',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'mainImage',
      title: 'Главное изображение',
      type: 'image',
      options: { hotspot: true },
    },
    {
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
    },
    {
      name: 'readTime',
      title: 'Время чтения (мин)',
      type: 'number',
    },
    {
      name: 'expert',
      title: 'Проверено экспертом ✅',
      type: 'boolean',
      description: 'Показатель E-E-A-T для доверия пользователей',
      initialValue: false,
    },
    {
      name: 'body',
      title: 'Текст статьи',
      type: 'array',
      of: [{ type: 'block' }],
    },
  ],
};
// === КОНЕЦ БЛОКА ===