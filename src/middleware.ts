import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('auth_token');
    const { pathname } = request.nextUrl;

    // Allow access to login page and api routes (except protected ones if any)
    if (pathname.startsWith('/login') || pathname.startsWith('/api/login') || pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')) {
        return NextResponse.next();
    }

    // If no auth cookie, redirect to login
    if (!authCookie) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
