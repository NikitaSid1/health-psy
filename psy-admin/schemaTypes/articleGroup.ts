// C:\Users\Admin\Desktop\psy\psy-admin\schemaTypes\articleGroup.ts
import { defineField, defineType } from 'sanity'
import { FolderIcon } from '@sanity/icons'

export default defineType({
  name: 'articleGroup',
  title: 'Группы статей (Оригиналы)',
  type: 'document',
  icon: FolderIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Системное название группы',
      description: 'Например: "Токсичные отношения (Оригинал)". Это название видно только вам в админке для объединения переводов.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})