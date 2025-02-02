'use client'
import { useState, useEffect } from "react";
import { CommentForm } from "./CommentForm"
import CommentsList from "./CommentsList"
import { getClientId } from "@/utils/voteService";

export const CommentsSection = ({ joke }) => {
    const [comments, setComments] = useState(joke.comments);
    const [hasMore, setHasMore] = useState(true);
    const [noComments, setNoComments] = useState(false);
    const [clientId, setClientId] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState({ comment: '', error: '' });

    useEffect(() => {
        setClientId(getClientId());

        if (!joke.comments.length) {
            setHasMore(false)
            setNoComments(true)
        }
    }, [])


    const fetchMorecomments = async () => {
        const res = await fetch(`/api/jokes/${joke._id}/comments?skip=${comments.length}}`)
        const newComments = await res.json();
        if (newComments.length === 0) {
            setHasMore(false);
        } else {
            setNoComments(false)
            setComments([...comments, ...newComments]);
        }
    };


    const handleChange = async () => {
        const res = await fetch(`/api/jokes/${joke._id}/comments`)
        const newInitialComments = await res.json();
        if (newInitialComments.length === 0) {
            setComments(newInitialComments);
            setHasMore(false)
            setNoComments(true)
        } else {
            setComments(newInitialComments);
            setHasMore(true);
        }
    }

    const endMessageClc = () => {
        if (noComments) {
            return <small>אין תגובות כרגע... אתה יכול להיות הראשון!</small>
        }
        return <small>זהו! אין עוד</small>
    }

    const handleDelete = async (commentId) => {
        setIsDeleting(true)
        setDeleteError({ comment: commentId, error: '' })
        try {
            const response = await fetch(`/api/jokes/${joke._id}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "ClientId": clientId,
                    Authorization: "Bearer yourTokenHere", // If authentication is needed
                },

            });

            if (!response.ok) {
                throw new Error('אופס... נראה שיש תקלה :( תנסה בבקשה שוב');
            }

            handleChange()

        } catch (error) {
            console.log(error)
            setDeleteError({ comment: commentId, error: 'נראה כאילו יש תקלה. תנסה למחוק שוב מאוחר יותר' })
        } finally {
            setIsDeleting(false);
        }

    }


    return (
        <>
            <h2>תגובות</h2>
            <CommentForm
                clientId={clientId}
                jokeId={joke._id}
                handleChange={handleChange}
            />
            <div style={{ height: "30px" }}></div>
            <CommentsList
                clientId={clientId}
                comments={comments}
                hasMore={hasMore}
                fetchMorecomments={fetchMorecomments}
                endMessage={endMessageClc}
                handleDelete={handleDelete}
                deleteError={deleteError}
                isDeleting={isDeleting}
            />
        </>
    )
}