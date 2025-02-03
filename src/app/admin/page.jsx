import { notFound, redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/session';
import Admin from '@/models/admin';
import { cookies } from 'next/headers'
import connectToDatabase from '@/lib/mongodb';
import Joke from '@/models/Joke';
import AdminJokeList from '@/components/jokes/AdminUi/AdminJokeList';

export default async function AdminPage() {
    const cookieStore = await cookies()
    const session = await getAdminSession(cookieStore.get('adminSession')?.value);
    if (!session?.adminId) {
        notFound()
    }
    const admin = await Admin.findById(session.adminId);
    if (!admin) {
        notFound()
    }

    await connectToDatabase();
    const initialJokes = await Joke.find({ approved: false })
        .sort({ _id: -1 })
        .limit(10);

    return (
        <div>
            <h1>הי לך {admin.username}👑</h1>
            <AdminJokeList initialJokes={JSON.parse(JSON.stringify(initialJokes))} />
        </div>
    );
}


