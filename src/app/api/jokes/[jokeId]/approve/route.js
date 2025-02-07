import connectToDatabase from '@/lib/mongodb';
import Joke from '@/models/Joke';
import { getAdminSession } from '@/lib/session';
import Admin from '@/models/admin';

export async function POST(request, { params }) {
    try {
        await connectToDatabase()

        const session = await getAdminSession(request.cookies.get('adminSession')?.value);
        if (!session?.adminId) {
            return Response.json({ success: false, error: "נו באמת לא חשבת שזה יהיה כזה קל" }, { status: 401 });
        }
        const admin = await Admin.findById(session.adminId);
        if (!admin) {
            return Response.json({ success: false, error: "נו באמת לא חשבת שזה יהיה כזה קל" }, { status: 401 });
        }

        const { jokeId } = await params;
        const joke = await Joke.findByIdAndUpdate(jokeId, { approved: true, approvedBy: admin.username });

        return Response.json({ success: true, joke });

    } catch {
        return Response.json(
            { error: error.message || 'Server error' },
            { status: 500 }
        );

    }
}