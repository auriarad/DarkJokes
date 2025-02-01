import connectToDatabase from '@/lib/mongodb';
import Joke from '@/models/Joke';


export async function GET(request) {

    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const skip = parseInt(searchParams.get('skip')) || 0;
        const sort = searchParams.get('sort') || '_id';
        const sortOrder = searchParams.get('sortOrder') || 'descending';
        const search = searchParams.get('search') || '';
        const categories = searchParams.get('categories') ? searchParams.get('categories').split(',') : [];

        const query = {};
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { title: searchRegex },
                { body: searchRegex }
            ];
        }
        if (categories.length > 0) {
            query.categories = { $in: categories };
        }
        console.log(sort, sortOrder);
        const jokes = await Joke.find(query)
            .sort({ [sort]: sortOrder, '_id': -1 })
            .skip(skip)
            .limit(10);

        return Response.json(jokes, { status: 200 });

    } catch (error) {
        if (error.message === 'Too many requests') {
            return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }
        return Response.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(request) {
    try {
        await connectToDatabase();
        const { title, body, categories } = await request.json();

        const newJoke = new Joke({
            title,
            body,
            categories,
        });

        await newJoke.save();
        return Response.json({ success: true, joke: newJoke }, { status: 201 });
    } catch (error) {
        if (error.message === 'Too many requests') {
            return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }

        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
