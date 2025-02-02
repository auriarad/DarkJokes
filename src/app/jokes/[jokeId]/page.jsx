import connectToDatabase from '@/lib/mongodb';
import Joke from '@/models/Joke';
import comment from '@/models/comment';
import JokeDetails from '@/components/jokes/JokeDetails';
import { notFound } from 'next/navigation';
import { CommentsSection } from "@/components/comments/CommentsSection";

export default async function JokePage({ params }) {
    const body = await params;
    await connectToDatabase();
    const joke = await Joke.findById(body.jokeId)
        .populate({
            path: 'comments',
            options: { sort: { createdAt: -1 }, limit: 6 }
        });

    if (!joke) {
        notFound();
    }
    if (joke.approved === false) {
        notFound();
    }

    return (
        <>
            <JokeDetails joke={JSON.parse(JSON.stringify(joke))} />
            <CommentsSection joke={JSON.parse(JSON.stringify(joke))} />
        </>
    );
}
