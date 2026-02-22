// C:\Users\Admin\Desktop\psy\psy-front\app\api\newsletter\route.ts
// === НАЧАЛО БЛОКА: Mailchimp Newsletter API ===
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const API_SERVER = process.env.MAILCHIMP_API_SERVER;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

    if (!API_KEY || !API_SERVER || !AUDIENCE_ID) {
      console.error('Mailchimp environment variables are missing!');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

    const data = {
      email_address: email,
      status: 'subscribed', // Сразу подписываем (можно 'pending' для Double Opt-in)
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `api_key ${API_KEY}`,
      },
      body: JSON.stringify(data),
    });

    if (response.status >= 400) {
      const errorData = await response.json();
      // Ошибка "Member Exists" означает, что юзер уже подписан (это тоже успех для нас)
      if (errorData.title === 'Member Exists') {
        return NextResponse.json({ success: true, message: 'Already subscribed' }, { status: 200 });
      }
      return NextResponse.json({ error: errorData.title || 'Error subscribing' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Newsletter Subscribe Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
// === КОНЕЦ БЛОКА ===