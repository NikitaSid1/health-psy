// === НАЧАЛО БЛОКА: Sanity Studio Config ===
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { documentInternationalization } from '@sanity/document-internationalization';
import { postSchema } from './sanity/schema'; 

export default defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  title: 'Health Psy CMS',
  
  plugins: [
    structureTool(),
    // Подключаем мультиязычность на уровне документов
    documentInternationalization({
      // Базовые языки проекта
      supportedLanguages: [
        { id: 'ru', title: 'Русский' },
        { id: 'en', title: 'English' },
        { id: 'ua', title: 'Українська' },
        { id: 'pl', title: 'Polski' },
        { id: 'de', title: 'Deutsch' },
      ],
      // Указываем, какие схемы будут мультиязычными
      schemaTypes: ['post'],
      // Язык по умолчанию, чтобы не было пустых полей
      languageField: 'language',
    })
  ],
  
  schema: {
    types: [postSchema], 
  },
});
// === КОНЕЦ БЛОКА ===