import connectToDatabase from '@/lib/mongodb';
import Joke from '@/models/Joke';
import JokeDetails from '@/components/jokes/JokeDetails';
import { notFound } from 'next/navigation';

export default async function JokePage({ params }) {
    const body = await params;
    await connectToDatabase();
    const joke = await Joke.findById(body.jokeId);

    if (!joke) {
        notFound();
    }

    return (
        <>
            <JokeDetails joke={JSON.parse(JSON.stringify(joke))} />
        </>
    );
}
