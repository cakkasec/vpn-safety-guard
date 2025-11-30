import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const body = await request.json();
    const { username, password } = body;

    // In a real app, you'd check a database.
    // Here we check against environment variables or a hardcoded list for simplicity.
    // Format: USER1=pass1,USER2=pass2
    // For this demo, we'll use a simple env var check.

    const validUser = process.env.AUTH_USER;
    const validPass = process.env.AUTH_PASS;

    // New: Support multiple users via AUTH_USERS="user1:pass1,user2:pass2"
    const multiUsers = process.env.AUTH_USERS || '';

    let isValid = false;

    // Check legacy single user
    if (validUser && validPass && username === validUser && password === validPass) {
        isValid = true;
    }

    // Check multiple users
    if (!isValid && multiUsers) {
        const users = multiUsers.split(',').map(u => u.trim());
        for (const u of users) {
            const [uName, uPass] = u.split(':');
            if (uName === username && uPass === password) {
                isValid = true;
                break;
            }
        }
    }

    if (isValid) {
        // Set a cookie
        const cookieStore = await cookies();
        cookieStore.set('auth_token', 'valid_session', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60, // 1 hour (Auto logout after inactivity)
        });

        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 401 });
}
