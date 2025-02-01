import Joke from "@/models/Joke";
import { redirect } from 'next/navigation'

export default async function RandomJoke() {

    const count = await Joke.countDocuments();
    if (count === 0) {
        throw new Error("אין בדיחות זמינות");
    }

    const random = Math.floor(Math.random() * count);
    const joke = await Joke.findOne().skip(random);

    if (!joke) {
        throw new Error("בדיחה לא נמצאה");
    }
    console.log(joke);
    redirect(`/jokes/${joke._id}`)
}
