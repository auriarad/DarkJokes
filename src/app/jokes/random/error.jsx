"use client"
export default function ErrorPage({ error }) {
    return (
        <div>
            <h1>שגיאה</h1>
            <p>{error.message || "אירעה שגיאה לא ידועה."}</p>
        </div>
    );
};

