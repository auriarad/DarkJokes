import connectToDatabase from '@/lib/mongodb';
import Joke from '@/models/Joke';
import comment from '@/models/comment';


export async function GET(request, { params }) {
    try {
        await connectToDatabase();
        const { jokeId } = await params;
        const { searchParams } = new URL(request.url);
        const skip = parseInt(searchParams.get('skip')) || 0;

        const joke = await Joke.findById(jokeId)
            .populate({
                path: 'comments',
                options: { sort: { createdAt: -1 }, skip, limit: 6 }
            });

        if (!joke) {
            return Response.json({ error: 'הבדיחה לא נמצאה' }, { status: 404 });
        }

        const comments = joke.comments;
        return Response.json(comments, { status: 200 });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(request, { params }) {
    try {
        await connectToDatabase();
        const { jokeId } = await params;

        const { name, body, clientId } = await request.json();

        if (!clientId || clientId.length < 10) {
            return Response.json({ error: 'Invalid client ID' }, { status: 400 });
        }

        const joke = await Joke.findById(jokeId);
        if (!joke) {
            return Response.json({ error: 'הבדיחה לא נמצאה' }, { status: 404 });
        }

        const newComment = new comment({
            name,
            body,
            clientId,
        });

        joke.comments.push(newComment);
        await newComment.save()
        await joke.save()

        return Response.json({ success: true, comment: newComment }, { status: 201 });

    } catch (error) {

        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
