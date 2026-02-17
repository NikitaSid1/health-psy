// === НАЧАЛО БЛОКА: Sanity Config Admin ===
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {documentInternationalization} from '@sanity/document-internationalization'

export default defineConfig({
  name: 'default',
  title: 'Health Psy CMS',
  // === НАЧАЛО БЛОКА: Sanity Config Admin ===
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'dp2yjc73', // 👈 Правильный Project ID
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  // === КОНЕЦ БЛОКА ===

  plugins: [
    structureTool(),
    visionTool(),
    // Возвращаем плагин переводов!
    documentInternationalization({
      supportedLanguages: [
        {id: 'ru', title: 'Русский'},
        {id: 'en', title: 'English'},
        {id: 'ua', title: 'Українська'},
        {id: 'pl', title: 'Polski'},
        {id: 'de', title: 'Deutsch'}
      ],
      schemaTypes: ['post'],
      languageField: 'language',
    })
  ],

  schema: {
    types: schemaTypes,
  },
})
// === КОНЕЦ БЛОКА ===