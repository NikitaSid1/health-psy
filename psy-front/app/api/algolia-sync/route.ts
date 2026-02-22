// C:\Users\Admin\Desktop\psy\psy-front\app\api\algolia-sync\route.ts
// === НАЧАЛО БЛОКА: Algolia Sync Webhook ===
import { NextResponse } from 'next/server';
import { algoliasearch } from 'algoliasearch';
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';

// Инициализируем клиент Algolia с ключом администратора (Admin Key)
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
);

const indexName = 'posts_index';
const secret = process.env.SANITY_WEBHOOK_SECRET!; // Секрет из .env

export async function POST(req: Request) {
  try {
    // 1. БЕЗОПАСНОСТЬ: Читаем сырое тело запроса и заголовок с подписью
    const signature = req.headers.get(SIGNATURE_HEADER_NAME) || '';
    const bodyText = await req.text();

    // 2. БЕЗОПАСНОСТЬ: Проверяем подпись. Если это не Sanity - отклоняем запрос (401)
    if (!isValidSignature(bodyText, signature, secret)) {
      console.error('Webhook signature mismatch!');
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 401 });
    }

    // 3. Если подпись верна, парсим данные
    const body = JSON.parse(bodyText);

    if (body._type !== 'post') {
      return NextResponse.json({ message: 'Not a post, ignoring.' }, { status: 200 });
    }

    // 4. Логика удаления (Синтаксис Algolia v5)
    if (body._deleted) {
      await client.deleteObject({
        indexName: indexName,
        objectID: body._id
      });
      return NextResponse.json({ message: `Deleted document ${body._id} from Algolia` });
    }

    // 5. Формируем теги
    const parsedTags = Array.isArray(body.tags) 
      ? body.tags.map((tag: any) => typeof tag === 'object' ? (tag.name || tag.slug?.current || tag._ref) : tag).filter(Boolean)
      : [];

    // 6. Формируем запись
    const record = {
      objectID: body._id, // Algolia требует objectID для корректного обновления
      title: body.title,
      slug: body.slug?.current || body.slug,
      category: body.category || "Статья",
      tags: parsedTags,
      language: body.language || 'ru',
    };

    // 7. Сохраняем в Algolia (Синтаксис v5)
    await client.saveObject({
      indexName: indexName,
      body: record
    });

    return NextResponse.json({ success: true, message: `Document ${body._id} synced to Algolia` });
    
  } catch (error) {
    console.error('Algolia Sync Error:', error);
    return NextResponse.json({ success: false, message: 'Sync failed' }, { status: 500 });
  }
}
// === КОНЕЦ БЛОКА ===