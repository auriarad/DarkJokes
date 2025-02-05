import connectToDatabase from '@/lib/mongodb';
import Joke from '@/models/Joke';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
    points: 10, // Allow 5 votes per IP per minute
    duration: 20, // Reset every 60 seconds
});

export async function POST(request, { params }) {
    await connectToDatabase();

    const { voteType, clientId } = await request.json();
    const { jokeId } = await params;

    // Validate voteType
    if (!['up', 'down'].includes(voteType)) {
        return Response.json({ error: 'Invalid vote type' }, { status: 400 });
    }

    // Validate client ID
    if (!clientId || clientId.length < 10) {
        return Response.json({ error: 'Invalid client ID' }, { status: 400 });
    }

    // **Rate limiting to prevent spam**
    const clientIp = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
    try {
        await rateLimiter.consume(clientIp); // Throws error if limit exceeded
    } catch {
        return Response.json({ error: 'לאט יותר אחי' }, { status: 429 });
    }

    try {
        const joke = await Joke.findById(jokeId);
        if (!joke) return Response.json({ error: 'Joke not found' }, { status: 404 });

        const voterIndex = joke.voters.findIndex(v => v.clientId === clientId);
        const now = Date.now();

        if (voterIndex !== -1) {
            const lastVoteTime = joke.voters[voterIndex].timestamp || 0;

            // **Cooldown check (5 seconds)**
            if (now - lastVoteTime < 5000) {
                return Response.json({ error: 'Wait before voting again!' }, { status: 429 });
            }

            const existingVote = joke.voters[voterIndex].voteType;
            if (existingVote === voteType) {
                // **Undo vote**
                joke.voters.splice(voterIndex, 1);
                if (existingVote === 'up') joke.ratingUp--;
                else joke.ratingDown--;
            } else {
                // **Switch vote**
                joke.voters[voterIndex].voteType = voteType;
                joke.voters[voterIndex].timestamp = now;
                if (voteType === 'up') {
                    joke.ratingUp++;
                    joke.ratingDown--;
                } else {
                    joke.ratingUp--;
                    joke.ratingDown++;
                }
            }
        } else {
            // **New vote**
            joke.voters.push({ clientId, voteType, timestamp: now });
            voteType === 'up' ? joke.ratingUp++ : joke.ratingDown++;
        }

        await joke.save();

        return Response.json({
            success: true,
            newRatingUp: joke.ratingUp,
            newRatingDown: joke.ratingDown,
            currentVote: voteType
        });

    } catch (error) {
        console.error(error);
        return Response.json(
            { error: error.message || 'Server error' },
            { status: 500 }
        );
    }
}
