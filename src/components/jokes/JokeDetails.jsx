'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/JokeDetails.module.css'

export default function JokeDetails({ joke }) {
    const [isEditing, setIsEditing] = useState(false);
    const [body, setBody] = useState(joke.body);
    const router = useRouter();

    const handleVote = async (type) => {
        const res = await fetch(`/api/jokes/${joke._id}/vote`, {
            method: 'POST',
            body: JSON.stringify({ type }),
        });

        if (res.ok) {
            router.refresh(); // Refresh to update the UI
        }
    };

    // const handleSave = async () => {
    //     const res = await fetch(`/api/jokes/${joke._id}`, {
    //         method: 'PATCH',
    //         body: JSON.stringify({ content }),
    //     });

    //     if (res.ok) {
    //         setIsEditing(false);
    //         router.refresh();
    //     }
    // };

    return (
        <div className={styles.container}>
            <div className={styles.jokeDetails}>
                <h1>{joke.title}</h1>
                {isEditing ? (
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                ) : (
                    <p>{body}</p>
                )}
            </div>
            <div className={styles.rating}>
                <p>
                    7{/* rating system here */}
                </p>
            </div>
            {/* <div className="actions">
                {isEditing ? (
                    <button onClick={handleSave}>Save</button>
                ) : (
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                )}
            </div> */}
        </div>
    );
}
