'use client';
import { useState, useEffect } from 'react';
import styles from '@/styles/JokeDetails.module.css'
import { DynamicRating } from '@/components/jokes/DynamicRating';
import { handleVote } from "@/utils/voteService";
import useAdmin from '@/hooks/useAdmin';
import DefaultButton from '../ui/DefaultButton';
import { EditForm } from './EditForm';
import { useRouter } from 'next/navigation'

export default function JokeDetails({ joke }) {
    const { isAdmin, loading, reCheck } = useAdmin();
    const [isEditing, setIsEditing] = useState(false);
    const [body, setBody] = useState(joke.body);
    const [title, setTitle] = useState(joke.title);

    const [currentRating, setCurrentRating] = useState(joke.rating);
    const [userVote, setUserVote] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const router = useRouter()

    useEffect(() => {
        const clientId = localStorage.getItem('clientId');
        const existingVote = joke.voters?.find(v => v.clientId === clientId);
        setUserVote(existingVote?.voteType || "");
    }, [joke.voters]);

    const handleVoteClick = async (e, voteType) => {
        e.stopPropagation();

        try {
            const previousVote = userVote;
            setUserVote(voteType === userVote ? "" : voteType);

            const newRating = currentRating + calculateRatingChange(previousVote, voteType);
            setCurrentRating(newRating);

            const result = await handleVote(joke._id, voteType);
            setCurrentRating(result.newRating);
        } catch (error) {
            setUserVote(previousVote);
            setCurrentRating(joke.rating);
        }
    };

    const calculateRatingChange = (previousVote, newVote) => {
        if (previousVote === newVote) {
            return previousVote === 'up' ? -1 : 1;
        }
        if (!previousVote) {
            return newVote === 'up' ? 1 : -1;
        }
        return newVote === 'up' ? 2 : -2;
    };

    const cancelEdit = () => {
        setIsEditing(false);
    }

    const updateJokeState = (data) => {
        const { body, title } = data;
        setBody(body);
        setTitle(title);
        setIsEditing(false);
    }

    const deleteJoke = async () => {
        setIsSubmitting(true);
        setSubmitError('');
        try {
            const response = await fetch(`/api/jokes/${joke._id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('אופס... נראה שיש תקלה :( תנסה בבקשה שוב');
            }

            router.push('/')

        } catch (error) {
            setSubmitError('אופס... נראה שיש תקלה :( תנסה בבקשה שוב');
        } finally {
            setIsSubmitting(false);
        }

    }

    return (
        <div className={styles.container}>
            <div className={styles.jokeDetails}>
                {isEditing ? (
                    <EditForm
                        jokeId={joke._id}
                        title={title}
                        body={body}
                        cancelEdit={cancelEdit}
                        updateJokeState={updateJokeState}
                    />
                ) : (
                    <>
                        <h1>{title}</h1>
                        <p>{body}</p>
                    </>
                )}

                {(isAdmin && !isEditing) &&
                    <>
                        <div className={styles.adminButton}>
                            <DefaultButton
                                variant='steel'
                                disabled={isSubmitting}
                                onClick={() => setIsEditing(true)

                                }
                            >
                                ערוך
                            </DefaultButton>

                            <div style={{ width: "20px" }}></div>
                            <DefaultButton
                                variant='orange'
                                onLongPress={deleteJoke}
                            >
                                {isSubmitting ? '...מוחק' : 'מחק'}
                            </DefaultButton >
                        </div>

                        {submitError && submitError}
                    </>
                }
            </div>

            <div className={styles.rating}>
                <DynamicRating size={1.3} rating={currentRating} handleVote={handleVoteClick} vote={userVote} />
            </div>
        </div>
    );
}
