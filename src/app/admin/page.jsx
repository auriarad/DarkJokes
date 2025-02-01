
import { notFound, redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/session';
import Admin from '@/models/admin';
import { cookies } from 'next/headers'

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

    console.log(admin)

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {/* Admin content */}
        </div>
    );
}


