// C:\Users\Admin\Desktop\psy\psy-admin\schemaTypes\index.ts
import blockContent from './blockContent'
import category from './category'
import post from './post'
import author from './author'
import tag from './tag'
import articleGroup from './articleGroup' // <-- 1. Импортируем наш новый файл

// Добавляем articleGroup в массив
export const schemaTypes = [post, author, category, blockContent, tag, articleGroup]