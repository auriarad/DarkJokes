"use client";
import { useState, useEffect } from "react";
import styles from "@/styles/JokeCard.module.css"
import Link from 'next/link';
import CategoryBadge from "./CategoriesBadge";
import { DynamicRating } from "./DynamicRating";
import { handleVote } from "@/utils/voteService";

export const JokeCard = ({ joke }) => {

    const [isExpanded, setIsExpanded] = useState(false);
    const [currentRating, setCurrentRating] = useState(joke.rating);
    const [userVote, setUserVote] = useState(null);

    // Check existing votes on mount
    useEffect(() => {
        const clientId = localStorage.getItem('clientId');
        const existingVote = joke.voters?.find(v => v.clientId === clientId);
        setUserVote(existingVote?.voteType || "");
    }, [joke.voters]);

    const handleVoteClick = async (e, voteType) => {
        e.stopPropagation();

        try {
            // Optimistic update
            const previousVote = userVote;
            setUserVote(voteType === userVote ? "" : voteType);

            const newRating = currentRating + calculateRatingChange(previousVote, voteType);
            setCurrentRating(newRating);

            // Send to API
            const result = await handleVote(joke._id, voteType);
            setCurrentRating(result.newRating);
        } catch (error) {
            // Rollback on error
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


    const toggleExpansion = (e) => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={styles.jokeContainer} onClick={toggleExpansion}>

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
                    <Link href={`/jokes/${joke._id}`}>עוד</Link>
                </div>

            </div>
            {!isExpanded ?
                <div className={styles.staticRating}>
                    <svg width="24px" height="24px" viewBox="0 -6 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 15L10 9.84985C10.2563 9.57616 10.566 9.35814 10.9101 9.20898C11.2541 9.05983 11.625 8.98291 12 8.98291C12.375 8.98291 12.7459 9.05983 13.0899 9.20898C13.434 9.35814 13.7437 9.57616 14 9.84985L19 15"
                            stroke={userVote === "up" ? "green" : "#93949e"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{currentRating}</span>
                    <svg width="25px" height="25px" viewBox="0 4 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 9L14 14.1599C13.7429 14.4323 13.4329 14.6493 13.089 14.7976C12.7451 14.9459 12.3745 15.0225 12 15.0225C11.6255 15.0225 11.2549 14.9459 10.9109 14.7976C10.567 14.6493 10.2571 14.4323 10 14.1599L5 9"
                            stroke={userVote === "down" ? "red" : "#93949e"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                :
                <DynamicRating rating={currentRating} handleVote={handleVoteClick} vote={userVote} />
            }
        </div>
    );
};


