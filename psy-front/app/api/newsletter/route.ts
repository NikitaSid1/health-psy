// C:\Users\Admin\Desktop\psy\psy-front\app\api\newsletter\route.ts
// === НАЧАЛО БЛОКА: Mock Mailchimp Newsletter API ===
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // 💡 ЗАГЛУШКА (MOCK): Логируем email и возвращаем успех.
    // Когда у тебя появится Mailchimp, просто удали этот блок и раскомментируй код ниже.
    console.log(`[NEWSLETTER MOCK] New subscription request for: ${email}`);
    
    // Искусственная задержка для имитации запроса (чтобы кнопка успела показать "loading")
    await new Promise(resolve => setTimeout(resolve, 800)); 
    return NextResponse.json({ success: true, message: 'Subscribed successfully (Mock)' }, { status: 200 });

    /*
    // --- РЕАЛЬНЫЙ КОД MAILCHIMP (Раскомментируй позже) ---
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const API_SERVER = process.env.MAILCHIMP_API_SERVER; // например us21
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

    if (!API_KEY || !API_SERVER || !AUDIENCE_ID) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;
    const data = { email_address: email, status: 'subscribed' };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `api_key ${API_KEY}` },
      body: JSON.stringify(data),
    });

    if (response.status >= 400) {
      const errorData = await response.json();
      if (errorData.title === 'Member Exists') {
        return NextResponse.json({ success: true, message: 'Already subscribed' }, { status: 200 });
      }
      return NextResponse.json({ error: errorData.title || 'Error subscribing' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully' }, { status: 200 });
    // --------------------------------------------------------
    */
    
  } catch (error) {
    console.error('Newsletter Subscribe Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
// === КОНЕЦ БЛОКА ===