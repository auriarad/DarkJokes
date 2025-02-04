'use client';
import { useState, useEffect } from 'react';
import styles from '@/styles/JokeDetails.module.css'
import { DynamicRating } from '@/components/jokes/DynamicRating';
import { handleVote, getClientId } from "@/utils/voteService";
import useAdmin from '@/hooks/useAdmin';
import DefaultButton from '../ui/DefaultButton';
import { EditForm } from './AdminUi/EditForm';
import { useRouter } from 'next/navigation'
import CategoryBadge from './CategoriesBadge';

export default function JokeDetails({ joke }) {
    const { isAdmin } = useAdmin();

    const [isEditing, setIsEditing] = useState(false);
    const [jokeState, setJokeState] = useState({ title: joke.title, body: joke.body, categories: joke.categories });

    const [currentRating, setCurrentRating] = useState(joke.rating);
    const [userVote, setUserVote] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const router = useRouter()

    useEffect(() => {
        const clientId = getClientId();
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
        const { body, title, categories } = data;
        setJokeState({ title, body, categories });
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
                        jokeState={jokeState}
                        cancelEdit={cancelEdit}
                        updateJokeState={updateJokeState}
                    />
                ) : (
                    <>
                        {jokeState.categories.map(category => (
                            <span key={category} style={{ marginLeft: '6px' }}>
                                <CategoryBadge>#{category}</CategoryBadge>
                            </span>
                        ))}
                        <h1>{jokeState.title}</h1>
                        <p>{jokeState.body}</p>
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
