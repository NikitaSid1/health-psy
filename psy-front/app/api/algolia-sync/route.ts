// app/api/algolia-sync/route.ts
import { NextResponse } from 'next/server';
// Именованный импорт для v5
import { algoliasearch } from 'algoliasearch';

// Инициализируем клиент Algolia. 
// ВАЖНО: Здесь мы используем ADMIN_KEY, так как нам нужны права на запись.
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
);

const indexName = 'posts_index';

export async function POST(req: Request) {
  try {
    // Читаем данные, которые прислал Sanity Webhook
    const body = await req.json();

    // Проверяем, что к нам пришла именно статья, а не другой тип документа
    if (body._type !== 'post') {
      return NextResponse.json({ message: 'Not a post, ignoring.' }, { status: 200 });
    }

    // Если документ был удален в Sanity -> удаляем его из Algolia (Синтаксис v5)
    if (body._deleted) {
      await client.deleteObject({
        indexName: indexName,
        objectID: body._id
      });
      return NextResponse.json({ message: `Deleted document ${body._id} from Algolia` });
    }

    // Формируем чистую запись для загрузки в Algolia
    const record = {
      objectID: body._id, // Algolia ОБОЖАЕТ поле objectID, это обязательно
      title: body.title,
      slug: body.slug?.current || body.slug,
      category: body.category || "Статья",
    };

    // Сохраняем/Обновляем запись в Algolia (Синтаксис v5)
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