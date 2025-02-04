'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import styles from '@/styles/CommentForm.module.css'

export const CommentForm = ({ jokeId, handleChange, clientId }) => {
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();


    const onSubmit = async (data) => {
        const { name, body } = data;
        setIsSubmitting(true);
        setSubmitError('');
        try {
            const response = await fetch(`/api/jokes/${jokeId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ name, body, clientId }),
            });

            if (!response.ok) {
                throw new Error('אופס.. נראה שיש תקלה :( תנסה בבקשה שוב');
            }

            reset()
            handleChange()


        } catch (error) {
            setSubmitError(error.message || 'אופס... נראה שיש תקלה :( תנסה בבקשה שוב');
        } finally {
            setIsSubmitting(false);
        }

    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formContainer}>
                <input
                    className={styles.name}
                    type="text"
                    placeholder='שמך בישראל'
                    {...register("name", {
                        required: "שים שם לא אמיתי אם בא לך",
                        maxLength: {
                            value: 25,
                            message: "שם קצת ארוך לא?"
                        },
                        pattern: {
                            value: /^[\p{L}\p{N}\p{P}\s]+$/u,
                            message: "בלי מקשים מיוחדים בבקשה"
                        }

                    })}
                />
                {errors.name && (
                    <span className={styles.errorMessage}>{errors.name.message}</span>
                )}

                <TextareaAutosize
                    className={styles.body}
                    minRows={2}
                    placeholder='חחח איזה מצחיק'
                    {...register("body", {
                        required: "איפה התגובה אבל",
                        maxLength: {
                            value: 300,
                            message: "יה מגזים תקצר טיפה"
                        },
                        pattern: {
                            value: /^[\p{L}\p{N}\p{P}\s]+$/u,
                            message: "בלי מקשים מיוחדים בבקשה"
                        }
                    })}
                />
                {errors.body && (
                    <span className={styles.errorMessage}>{errors.body.message}</span>
                )}

                {submitError && <p className={styles.errorMessage}>{submitError}</p>}

            </div>
            <button disabled={isSubmitting} className={styles.addBtn}></button>
        </form>
    )
}