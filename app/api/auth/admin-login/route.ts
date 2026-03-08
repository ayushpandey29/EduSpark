import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // Fixed Admin Credentials
        if (email === 'admin@eduspark.com' && password === 'admin123') {
            return NextResponse.json({
                message: 'Admin login successful',
                user: {
                    id: 'admin',
                    name: 'Admin',
                    email: 'admin@eduspark.com',
                    isAdmin: true,
                }
            });
        }

        return NextResponse.json({ message: 'Invalid admin credentials' }, { status: 401 });
    } catch (error) {
        console.error('Admin login error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
