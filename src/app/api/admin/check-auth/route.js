import { getAdminSession } from '@/lib/session';
import Admin from '@/models/admin';
import connectToDatabase from '@/lib/mongodb';

export async function GET(req) {
    try {
        await connectToDatabase()

        const session = await getAdminSession(req.cookies.get('adminSession')?.value);

        if (!session?.adminId) {
            return Response.json({ isAdmin: false });
        }

        // Verify admin exists
        const admin = await Admin.findById(session.adminId);
        return Response.json({ isAdmin: !!admin });

    } catch (error) {
        return Response.json({ isAdmin: false });
    }
}
