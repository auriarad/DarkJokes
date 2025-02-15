import Joke from "@/models/Joke";
import { redirect } from 'next/navigation'
import connectToDatabase from "@/lib/mongodb";

export const dynamic = 'force-dynamic'

export default async function RandomJoke() {
    await connectToDatabase();
    const count = await Joke.countDocuments({ approved: true });
    if (count === 0) {
        throw new Error("אין בדיחות זמינות");
    }
    const random = Math.floor(Math.random() * count);

    const joke = await Joke.findOne({ approved: true }).skip(random);

    if (!joke) {
        throw new Error("בדיחה לא נמצאה");
    }

    redirect(`/jokes/${joke._id}`);
}
