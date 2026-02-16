// === НАЧАЛО БЛОКА: Sanity Studio Config ===
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

export default defineConfig({
  basePath: '/studio', // Путь, по которому будет доступна админка
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  title: 'Health Psy CMS',
  
  // Подключаем стандартный интерфейс студии
  plugins: [structureTool()],
  
  schema: {
    // Сюда мы чуть позже добавим нашу схему статьи
    types: [], 
  },
});
// === КОНЕЦ БЛОКА ===