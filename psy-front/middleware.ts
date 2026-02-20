// C:\Users\Admin\Desktop\psy\psy-front\middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Список поддерживаемых языков
const locales = ['ru', 'en', 'ua', 'pl', 'de'];
// Язык по умолчанию, если язык браузера не подошел (поставили английский)
const defaultLocale = 'en'; 

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Пропускаем системные файлы Next.js, картинки и админку Sanity
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/studio') || // Защищаем админку
    pathname.startsWith('/api') ||
    pathname.includes('.') // Файлы вроде favicon.ico, icon.png, sitemap.xml
  ) {
    return NextResponse.next();
  }

  // 2. Проверяем, есть ли уже локаль в URL (например, /en/post/...)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Если локаль уже есть, просто пропускаем дальше
  if (pathnameHasLocale) return NextResponse.next();

  // 3. Определяем язык из настроек браузера пользователя
  const acceptLanguage = request.headers.get('accept-language');
  let locale = defaultLocale; 

  if (acceptLanguage) {
    // Вытаскиваем главный язык браузера (например, "ru-RU" -> "ru")
    const preferred = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
    
    // В браузерах украинский язык обозначается как 'uk', меняем на нашу папку 'ua'
    let mappedLocale = preferred;
    if (preferred === 'uk') mappedLocale = 'ua';

    // Если у нас есть запрашиваемый язык, ставим его. Иначе останется английский.
    if (locales.includes(mappedLocale)) {
      locale = mappedLocale;
    } 
  }

  // 4. Делаем редирект на нужную локаль
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

// Указываем Next.js, для каких путей запускать этот middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.png|sitemap.xml|robots.txt).*)',
  ],
};