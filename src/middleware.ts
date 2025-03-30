import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { DEFAULT_REDIRECT, PROTECTED_ROUTES, PUBLIC_ROUTES } from './config/routes';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    if (token) {
      const decoded = await verifyToken(token);
      if (decoded) {
        url.pathname = DEFAULT_REDIRECT;
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  }

  // Skip middleware for public routes
  // if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
  //   if (token) {
  //     const decoded = await verifyToken(token);
  //     if (decoded) {
  //       url.pathname = '/';
  //       return NextResponse.redirect(url);
  //     }
  //   }
  //   return NextResponse.next();
  // }

  // Redirect to login if no token on protected routes
  if (!token && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Verify token for protected routes
  if (token && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    try {
      const decoded = await verifyToken(token);
      if (!decoded) {
        throw new Error('Invalid token');
      }
      return NextResponse.next();
    } catch (error) {
      url.pathname = '/login';
      const response = NextResponse.redirect(url);
      response.cookies.delete('token');
      console.log(error)
      return response;
    }
  }

  // if (token && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
  //   try {
  //     const secretKey = process.env.SECRET_KEY;
  //     if (!secretKey) {
  //       throw new Error("SECRET_KEY is not defined in environment variables");
  //     }
  //     const decoded = jwt.verify(token, secretKey) as unknown as { userId: number; exp: number };
  //     if (Date.now() >= decoded.exp * 1000) {
  //       throw new Error("Token expired");
  //     }
  //   } catch (error) {
  //     url.pathname = '/login';
  //     const response = NextResponse.redirect(url);
  //     response.cookies.delete("token");
  //     console.log(error);
  //     return response;
  //   }
  // }

  // Allow all other routes
  return NextResponse.next();
}