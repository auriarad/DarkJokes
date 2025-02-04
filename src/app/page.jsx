import connectToDatabase from '@/lib/mongodb';
import Joke from '@/models/Joke';
import Styles from "@/styles/homePage.module.css"
import { MessageModal } from '@/components/ui/MessageModal';
import JokeList from '@/components/jokes/JokesList';

export default async function Home({ initialJokes }) {
  return (
    <>
      <div className={Styles.openning}>
        <h1>ברוך הבא לאתר הבדיחות השחורות הישראלי</h1>
        <p>אחרי שנים של איסוף ומיון קפדני, פה ניתן למצוא את לקט הבדיחות הכי נוראיות והכי אפלות שנאמרו בשפה העברית</p>
      </div>

      <JokeList initialJokes={initialJokes} />

      <MessageModal message="jokeSubmissionSuccess">
        <h2>תודה על תרומתך הצנועה למאגר!</h2>
        <p>הבדיחה שלך נשמרה במערכת ותופיע ברשימה אם תהיה מספיק מצחיקה ושחורה.</p>
      </MessageModal>
    </>
  );
}

export async function getServerSideProps() {
  await connectToDatabase();
  const jokes = await Joke.find({ approved: true }).sort({ _id: -1 }).limit(10);

  return {
    props: {
      initialJokes: JSON.parse(JSON.stringify(jokes))
    },
  };
}