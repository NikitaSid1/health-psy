// === НАЧАЛО БЛОКА: Sanity Config Admin ===
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {documentInternationalization} from '@sanity/document-internationalization'

export default defineConfig({
  name: 'default',
  title: 'Health Psy CMS',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'dp2yjc73',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    // 👇 ДОБАВЛЕНО: Кастомная структура, скрывающая Translation Metadata
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            ...S.documentTypeListItems().filter(
              (listItem) => listItem.getId() !== 'translation.metadata'
            ),
          ]),
    }),
    visionTool(),
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