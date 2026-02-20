import blockContent from './blockContent'
import category from './category'
import post from './post'
import author from './author'
import tag from './tag' // <-- 1. Импортируем наш новый файл

export const schemaTypes = [post, author, category, blockContent, tag]
