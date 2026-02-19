// === НАЧАЛО БЛОКА: blockContent ===
import { defineType, defineArrayMember } from 'sanity'

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' }
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              { title: 'URL', name: 'href', type: 'url' },
            ],
          },
        ],
      },
    }),
    
    // 🖼 БЛОК: Изображение
    defineArrayMember({
      type: 'image',
      title: 'Картинка',
      options: { hotspot: true },
    }),
    
    // 💡 БЛОК 1: Инфобокс / Мнение эксперта (Для E-E-A-T)
    defineArrayMember({
      name: 'infoBox',
      title: 'Мнение эксперта / Плашка',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Тип плашки',
          type: 'string',
          options: {
            list: [
              { title: 'Мнение психолога', value: 'expert' },
              { title: 'Важное предупреждение', value: 'warning' },
              { title: 'Научный факт', value: 'science' }
            ]
          },
          initialValue: 'expert'
        },
        { name: 'author', title: 'Имя эксперта (опционально)', type: 'string' },
        { name: 'text', title: 'Текст', type: 'text', validation: (Rule) => Rule.required() }
      ]
    }),
    
    // 💡 БЛОК 2: Обычный YouTube
    defineArrayMember({
      name: 'youtube',
      title: 'YouTube Видео (Горизонтальное)',
      type: 'object',
      fields: [
        { 
          name: 'url', 
          title: 'URL видео', 
          type: 'url',
          description: 'Вставь обычную ссылку на YouTube видео'
        }
      ]
    }),

    // 💡 БЛОК 3: YouTube Shorts / Reels
    defineArrayMember({
      name: 'youtubeShorts',
      title: 'YouTube Shorts (Вертикальное)',
      type: 'object',
      fields: [
        { 
          name: 'url', 
          title: 'URL Shorts', 
          type: 'url',
          description: 'Вставь ссылку на YouTube Shorts'
        }
      ]
    }),
    
    // 💡 БЛОК 4: Интерактивный мини-тест
    defineArrayMember({
      name: 'quiz',
      title: 'Мини-тест',
      type: 'object',
      fields: [
        { name: 'title', title: 'Название теста (например: Уровень тревоги)', type: 'string' },
        {
          name: 'questions',
          title: 'Вопросы',
          type: 'array',
          of: [{
            name: 'questionItem', // <-- ИСПРАВЛЕНИЕ ДЛЯ ДЕПЛОЯ (строгое имя объекта)
            type: 'object',
            fields: [
              { name: 'question', title: 'Вопрос', type: 'string' },
              { 
                name: 'options', 
                title: 'Варианты ответа', 
                type: 'array', 
                of: [{ 
                  name: 'optionItem', // <-- ИСПРАВЛЕНИЕ ДЛЯ ДЕПЛОЯ (на всякий случай даем имя и строке)
                  type: 'string' 
                }] 
              }
            ]
          }]
        }
      ]
    })
  ],
})
// === КОНЕЦ БЛОКА ===