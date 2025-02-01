import connectToDatabase from '@/lib/mongodb';
import Joke from '@/models/Joke';
import JokeDetails from '@/components/jokes/JokeDetails';

export default async function JokePage({ params }) {
    const body = await params;
    await connectToDatabase();
    const joke = await Joke.findById(body.jokeId);

    if (!joke) {
        return <div>Joke not found!</div>;
    }

    return (
        <>
            <JokeDetails joke={JSON.parse(JSON.stringify(joke))} />
        </>
    );
}
