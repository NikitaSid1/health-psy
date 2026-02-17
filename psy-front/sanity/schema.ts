// === НАЧАЛО БЛОКА: Sanity Post Schema ===
export const postSchema = {
  name: 'post',
  title: 'Статья',
  type: 'document',
  fields: [
    {
      // 👈 Новое поле: Видимый индикатор языка для редактора
      name: 'language',
      title: '🌐 Язык статьи (Language)',
      type: 'string',
      description: 'Устанавливается автоматически при создании перевода',
      options: {
        list: [
          { title: '🇷🇺 Русский', value: 'ru' },
          { title: '🇬🇧 English', value: 'en' },
          { title: '🇺🇦 Українська', value: 'ua' },
          { title: '🇵🇱 Polski', value: 'pl' },
          { title: '🇩🇪 Deutsch', value: 'de' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'ru', // Для новых "базовых" статей всегда ставим русский
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Заголовок',
      type: 'string',
      validation: (Rule: any) => Rule.required().error('Заголовок обязателен'),
    },
// === НАЧАЛО БЛОКА: Sanity Post Schema (Обновленный Slug) ===
    {
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
            slug: value, // 👈 ИСПРАВЛЕНИЕ ЗДЕСЬ: просто value, а не value.current
            language: language,
          };

          // Ищем дубли с таким же слагом и ТАКИМ ЖЕ языком (кроме самой себя)
          const query = `!defined(*[!(_id in [$draft, $published]) && slug.current == $slug && language == $language][0]._id)`;
          
          return await client.fetch(query, params);
        }
      },
      validation: (Rule: any) => Rule.required(),
    },
// === КОНЕЦ БЛОКА ===
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
      of: [
        { type: 'block' }, // Обычный текст с форматированием
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
    },
  ],
};
// === КОНЕЦ БЛОКА ===