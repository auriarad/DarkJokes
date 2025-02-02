import { NewForm } from "@/components/jokes/NewForm";
import connectToDatabase from '@/lib/mongodb';

export default async function NewPage() {
    await connectToDatabase();

    return (
        <>
            <h1 style={{ textAlign: "center" }}>הוסף בדיחה חדשה</h1>
            <NewForm />
        </>
    );
}
