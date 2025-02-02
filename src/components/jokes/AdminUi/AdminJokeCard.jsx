"use client";
import { useState } from "react";
import styles from "@/styles/JokeCard.module.css"
import CategoryBadge from "../CategoriesBadge";
import DefaultButton from "@/components/ui/DefaultButton";

export const AdminJokeCard = ({ joke, after }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');


    const toggleExpansion = (e) => {
        if (!e.target.closest("#buttons")) {
            setIsExpanded(!isExpanded);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        setSubmitError('');
        try {
            const response = await fetch(`/api/jokes/${joke._id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('אופס... נראה שיש תקלה :( תנסה בבקשה שוב');
            }

            after()

        } catch (error) {
            setSubmitError('אופס... נראה שיש תקלה :( תנסה בבקשה שוב');
        } finally {
            setIsSubmitting(false);
        }

    }

    const handleAprove = async () => {
        setIsSubmitting(true);
        setSubmitError('');
        try {
            const response = await fetch(`/api/jokes/${joke._id}/approve`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('אופס... נראה שיש תקלה :( תנסה בבקשה שוב');
            }

            after()

        } catch (error) {
            setSubmitError('אופס... נראה שיש תקלה :( תנסה בבקשה שוב');
        } finally {
            setIsSubmitting(false);
        }

    }

    return (
        <div id="container" className={styles.jokeContainer} onClick={toggleExpansion}>
            <div style={{ flex: 1 }}>
                <div className={styles.categoryList}>
                    {joke.categories.map((category) => (
                        <CategoryBadge
                            key={category}
                        >
                            #{category}
                        </CategoryBadge>
                    ))}

                </div>

                <h2 className={styles.jokeTitle}>{joke.title}</h2>

                <div className={`${styles.collapse} ${isExpanded ? styles.show : ''}`}>
                    {joke.body}
                    <br />
                    <div id="buttons" style={{ display: 'inline-flex', flexDirection: 'row', marginTop: '15px' }}>
                        <DefaultButton
                            disabled={isSubmitting}
                            variant="purple"
                            onClick={handleAprove}
                        >
                            אשר
                        </DefaultButton>

                        <div style={{ width: "10px" }}></div>

                        <DefaultButton
                            variant="orange"
                            disabled={isSubmitting}
                            onLongPress={handleDelete}
                        >
                            מחק
                        </DefaultButton>
                    </div>
                    <p className={styles.errorMessage}>{submitError && submitError}</p>
                </div>

            </div>
        </div>
    );
};


