// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Список поддерживаемых языков (те же, что мы задали в Sanity)
const locales = ['ru', 'en', 'ua', 'pl', 'de'];
const defaultLocale = 'ru'; // Язык по умолчанию

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Пропускаем системные файлы Next.js, картинки и админку Sanity (!ВАЖНО!)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/studio') || // Защищаем админку
    pathname.startsWith('/api') ||
    pathname.includes('.') // Файлы вроде favicon.ico или robots.txt
  ) {
    return NextResponse.next();
  }

  // 2. Проверяем, есть ли уже локаль в URL (например, /en/post/...)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Если локаль уже есть, просто пропускаем дальше
  if (pathnameHasLocale) return NextResponse.next();

  // 3. Если локали нет (пользователь зашел на корень /), делаем редирект на дефолтную (ru)
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

// Указываем Next.js, для каких путей запускать этот middleware
export const config = {
  matcher: [
    // Применять ко всем путями, кроме внутренних и статики
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};