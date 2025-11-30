import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const body = await request.json();
    const { username, password } = body;

    // In a real app, you'd check a database.
    // Here we check against environment variables or a hardcoded list for simplicity.
    // Format: USER1=pass1,USER2=pass2
    // For this demo, we'll use a simple env var check.

    const validUser = process.env.AUTH_USER || 'admin';
    const validPass = process.env.AUTH_PASS || 'password123';

    // Support multiple users via comma separation if needed in future, 
    // but for now simple 1:1 match.

    if (username === validUser && password === validPass) {
        // Set a cookie
        const cookieStore = await cookies();
        cookieStore.set('auth_token', 'valid_session', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 401 });
}
