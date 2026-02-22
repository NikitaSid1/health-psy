// C:\Users\Admin\Desktop\psy\psy-front\app\api\newsletter\route.ts
// === НАЧАЛО БЛОКА: Real Mailchimp Newsletter API ===
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // ИЗМЕНЕНИЕ: Принимаем email и lang из запроса
    const { email, lang } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const API_SERVER = process.env.MAILCHIMP_API_SERVER; // например us21
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

    if (!API_KEY || !API_SERVER || !AUDIENCE_ID) {
      console.error('Mailchimp API keys are missing in .env.local!');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // ИЗМЕНЕНИЕ: Формируем тег языка (по умолчанию EN, если язык не определен)
    const languageTag = lang ? `Lang: ${lang.toUpperCase()}` : 'Lang: EN';

    const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;
    
    // ИЗМЕНЕНИЕ: Добавляем теги в payload для Mailchimp
    const data = { 
      email_address: email, 
      status: 'subscribed',
      tags: ['Website Subscriber', languageTag] // Эти теги автоматически появятся у контакта
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Basic ${Buffer.from(`anystring:${API_KEY}`).toString('base64')}`
      },
      body: JSON.stringify(data),
    });

    if (response.status >= 400) {
      const errorData = await response.json();
      
      if (errorData.title === 'Member Exists') {
        return NextResponse.json({ success: true, message: 'Already subscribed' }, { status: 200 });
      }
      
      console.error('Mailchimp error:', errorData);
      return NextResponse.json({ error: errorData.title || 'Error subscribing' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully' }, { status: 200 });
    
  } catch (error) {
    console.error('Newsletter Subscribe Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
// === КОНЕЦ БЛОКА ===