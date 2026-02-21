// C:\Users\Admin\Desktop\psy\psy-front\app\api\algolia-sync\route.ts
import { NextResponse } from 'next/server';
import { algoliasearch } from 'algoliasearch';

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
);

const indexName = 'posts_index';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body._type !== 'post') {
      return NextResponse.json({ message: 'Not a post, ignoring.' }, { status: 200 });
    }

    if (body._deleted) {
      await client.deleteObject({
        indexName: indexName,
        objectID: body._id
      });
      return NextResponse.json({ message: `Deleted document ${body._id} from Algolia` });
    }

    // Обрабатываем теги. Если webhook Sanity настроен с GROQ-проекцией, 
    // теги могут прийти как объекты. Мы вытягиваем из них строки (name или slug).
    const parsedTags = Array.isArray(body.tags) 
      ? body.tags.map((tag: any) => typeof tag === 'object' ? (tag.name || tag.slug?.current || tag._ref) : tag).filter(Boolean)
      : [];

    const record = {
      objectID: body._id,
      title: body.title,
      slug: body.slug?.current || body.slug,
      category: body.category || "Статья",
      tags: parsedTags,
      language: body.language || 'ru', // Полезно для фильтрации поиска по языку внутри Algolia
    };

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