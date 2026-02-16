// === НАЧАЛО БЛОКА: Sanity Studio Config ===
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { postSchema } from './sanity/schema'; // 👈 1. Импортируем нашу схему статьи

export default defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  title: 'Health Psy CMS',
  
  plugins: [structureTool()],
  
  schema: {
    types: [postSchema], // 👈 2. Регистрируем схему в админке
  },
});
// === КОНЕЦ БЛОКА ===