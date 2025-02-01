import connectToDatabase from '@/lib/mongodb';
import Joke from '@/models/Joke';

export async function POST(request, { params }) {

    await connectToDatabase();
    const { voteType, clientId } = await request.json();
    const { jokeId } = await params;

    if (!clientId || clientId.length < 10) {
        return Response.json({ error: 'Invalid client ID' }, { status: 400 });
    }


    try {
        const joke = await Joke.findById(jokeId);
        if (!joke) return Response.json({ error: 'Joke not found' }, { status: 404 });

        const voterIndex = joke.voters.findIndex(v => v.clientId === clientId);
        let ratingChange = 0;

        if (voterIndex === -1) {
            joke.voters.push({ clientId, voteType });
            ratingChange = voteType === 'up' ? 1 : -1;
        } else {
            const existingVote = joke.voters[voterIndex].voteType;
            if (existingVote === voteType) {
                joke.voters.splice(voterIndex, 1);
                ratingChange = voteType === 'up' ? -1 : 1;
            } else {
                joke.voters[voterIndex].voteType = voteType;
                ratingChange = voteType === 'up' ? 2 : -2;
            }
        }

        joke.rating += ratingChange;
        await joke.save();

        return Response.json({
            success: true,
            newRating: joke.rating,
            currentVote: voteType
        });

    } catch (error) {

        return Response.json(
            { error: error.message || 'Server error' },
            { status: 500 }
        );
    }
}
