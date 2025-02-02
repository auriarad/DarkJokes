import connectToDatabase from '@/lib/mongodb';
import Joke from '@/models/Joke';
import { getAdminSession } from '@/lib/session';
import Admin from '@/models/admin';


export async function GET(request) {

    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const skip = parseInt(searchParams.get('skip')) || 0;
        const sort = searchParams.get('sort') || '_id';
        const sortOrder = searchParams.get('sortOrder') || 'descending';
        const search = searchParams.get('search') || '';
        const categories = searchParams.get('categories') ? searchParams.get('categories').split(',') : [];

        const approved = searchParams.get('approved') || 'true';

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
        if (approved === 'false') {
            const session = await getAdminSession(request.cookies.get('adminSession')?.value);
            if (!session?.adminId) {
                return Response.json({ success: false, error: "נו באמת לא חשבת שזה יהיה כזה קל" }, { status: 401 });
            }
            const admin = await Admin.findById(session.adminId);
            if (!admin) {
                return Response.json({ success: false, error: "נו באמת לא חשבת שזה יהיה כזה קל" }, { status: 401 });
            }
            query.approved = false;
        } else {
            query.approved = true;
        }

        let jokes = null;
        if (sort === "comments") {
            const sortByNum = sortOrder === 'descending' ? -1 : 1
            console.log(sortByNum)

            jokes = await Joke.aggregate([
                { $match: query },
                {
                    $addFields: {
                        commentsLength: { $size: "$comments" }
                    }
                },
                {
                    $sort: {
                        commentsLength: sortByNum,
                        _id: -1
                    }
                },
                { $skip: skip },
                { $limit: 10 }
            ]);
        }
        else {
            jokes = await Joke.find(query)
                .sort({ [sort]: sortOrder, '_id': -1 })
                .skip(skip)
                .limit(10);
        }

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
        let approved = false
        //check admin
        const session = await getAdminSession(request.cookies.get('adminSession')?.value);
        if (session?.adminId) {
            const admin = await Admin.findById(session.adminId);
            if (!!admin) {
                approved = true;
            }
        }



        await connectToDatabase();
        const { title, body, categories } = await request.json();

        const newJoke = new Joke({
            title,
            body,
            categories,
            approved,
        });

        await newJoke.save();
        return Response.json({ success: true, admin: approved, joke: newJoke }, { status: 201 });
    } catch (error) {
        if (error.message === 'Too many requests') {
            return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }

        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
