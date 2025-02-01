import connectToDatabase from '@/lib/mongodb';
import Joke from '@/models/Joke';

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
        const { title, body } = await request.json();

        const updatedJoke = await Joke.findByIdAndUpdate(
            params.jokeId,
            { title, body },
            { new: true }
        );

        if (!updatedJoke) {
            return Response.json({ success: false, error: 'Joke not found' }, { status: 404 });
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
        //sec
        const { valid, error } = validateRequest(request);
        if (!valid) return Response.json({ error }, { status: 400 });

        await connectToDatabase();
        const deletedJoke = await Joke.findByIdAndDelete(params.jokeId);

        if (!deletedJoke) {
            return Response.json({ success: false, error: 'Joke not found' }, { status: 404 });
        }

        return Response.json({ success: true, joke: deletedJoke }, { status: 200 });
    } catch (error) {
        if (error.message === 'Too many requests') {
            return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
