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

        if (voterIndex === -1) {
            joke.voters.push({ clientId, voteType });
            voteType === 'up' ? joke.ratingUp++ : joke.ratingDown++;

        } else {
            const existingVote = joke.voters[voterIndex].voteType;
            if (existingVote === voteType) {
                joke.voters.splice(voterIndex, 1);
                if (existingVote === 'up') {
                    joke.ratingUp--;
                } else {
                    joke.ratingDown--;
                }
            } else {
                joke.voters[voterIndex].voteType = voteType;
                if (voteType === 'up') {
                    joke.ratingUp++;
                    joke.ratingDown--;
                } else {
                    joke.ratingUp--;
                    joke.ratingDown++;
                }
            }
        }

        await joke.save();

        return Response.json({
            success: true,
            newRatingUp: joke.ratingUp,
            newRatingDown: joke.ratingDown,
            currentVote: voteType
        });

    } catch (error) {
        console.log(error)
        return Response.json(
            { error: error.message || 'Server error' },
            { status: 500 }
        );
    }
}
