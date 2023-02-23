import { NextResponse } from 'next/server';

import { getUserIdFromJwtToken } from './helpers';

export async function middleware(request, _) {
  const token = request.cookies.get('token')
    ? request.cookies.get('token').value
    : null;

  const userId = await getUserIdFromJwtToken(token);
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/login') ||
    userId ||
    pathname.includes('/static')
  ) {
    return NextResponse.next();
  }

  if ((!token || !userId) && pathname !== '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(new URL(url));
  }
}
