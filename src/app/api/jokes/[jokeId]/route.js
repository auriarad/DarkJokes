import connectToDatabase from '@/lib/mongodb';
import Joke from '@/models/Joke';
import { getAdminSession } from '@/lib/session';
import Admin from '@/models/admin';

export async function GET(request, { params }) {
    try {
        await connectToDatabase();
        const { jokeId } = await params;
        const joke = await Joke.findById(jokeId);

        if (!joke) {
            return Response.json({ success: false, error: 'Joke not found' }, { status: 404 });
        }

        return Response.json({ success: true, joke }, { status: 200 });
    } catch (error) {
        if (error.message === 'Too many requests') {
            return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        await connectToDatabase();
        //check admin
        const session = await getAdminSession(request.cookies.get('adminSession')?.value);
        if (!session?.adminId) {
            return Response.json({ success: false, error: "נו באמת לא חשבת שזה יהיה כזה קל" }, { status: 401 });
        }
        const admin = await Admin.findById(session.adminId);
        if (!admin) {
            return Response.json({ success: false, error: "נו באמת לא חשבת שזה יהיה כזה קל" }, { status: 401 });
        }

        const { title, body } = await request.json();
        const { jokeId } = await params;

        const updatedJoke = await Joke.findByIdAndUpdate(
            jokeId,
            { title, body },
            { new: true }
        );

        if (!updatedJoke) {
            return Response.json({ success: false, error: 'אופס לא מצאנו את הבדיחה' }, { status: 404 });
        }

        return Response.json({ success: true, joke: updatedJoke }, { status: 200 });
    } catch (error) {
        if (error.message === 'Too many requests') {
            return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectToDatabase();
        //check admin
        const session = await getAdminSession(request.cookies.get('adminSession')?.value);
        if (!session?.adminId) {
            return Response.json({ success: false, error: "נו באמת לא חשבת שזה יהיה כזה קל" }, { status: 401 });
        }
        const admin = await Admin.findById(session.adminId);
        if (!admin) {
            return Response.json({ success: false, error: "נו באמת לא חשבת שזה יהיה כזה קל" }, { status: 401 });
        }

        const { jokeId } = await params;
        const deletedJoke = await Joke.findByIdAndDelete(jokeId);

        if (!deletedJoke) {
            return Response.json({ success: false, error: 'אופס לא מצאנו את הבדיחה' }, { status: 404 });
        }

        return Response.json({ success: true, joke: deletedJoke }, { status: 200 });

    } catch (error) {
        if (error.message === 'Too many requests') {
            return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
