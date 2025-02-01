import { NewForm } from "@/components/jokes/NewForm";

export default async function NewPage() {
    return (
        <>
            <h1 style={{ textAlign: "center" }}>הוסף בדיחה חדשה</h1>
            <NewForm />
        </>
    );
}
