import Admin from '@/models/admin';
import bcrypt from 'bcryptjs';
import { createAdminSession } from '@/lib/session';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';

export async function POST(req) {
    try {
        await connectToDatabase()

        const { username, password } = await req.json();
        const admin = await Admin.findOne({ username });

        // Verify credentials
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return NextResponse.json(
                { error: 'משתמש או ססמא לא נכונים' },
                { status: 401 }
            );
        }

        // Create session
        const sessionCookie = await createAdminSession(admin._id.toString());

        // Set cookie
        const response = NextResponse.json({ success: true });
        response.cookies.set('adminSession', sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 21, // 1 week
            path: '/',
            sameSite: 'lax'
        });

        return response;

    } catch (error) {
        return NextResponse.json(
            { error: 'יש אצלנו בעיה ): תנסה שוב מאוחר יותר' },
            { status: 500 }
        );
    }
}
