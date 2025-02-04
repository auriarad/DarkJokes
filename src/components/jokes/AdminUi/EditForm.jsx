import TextareaAutosize from 'react-textarea-autosize';
import styles from '@/styles/EditForm.module.css'
import DefaultButton from '../../ui/DefaultButton';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

export const EditForm = ({ title, body, jokeId, cancelEdit, updateJokeState }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError('');
        try {
            const response = await fetch(`/api/jokes/${jokeId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('אופס... נראה שיש תקלה :( תנסה בבקשה שוב');
            }

            updateJokeState(data)

        } catch (error) {
            setSubmitError('אופס... נראה שיש תקלה :( תנסה בבקשה שוב');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                className={styles.titleEdit}
                type="text"
                id='titleInput'
                defaultValue={title}
                {...register("title", {
                    required: "סליחה אחי חייב כותרת",
                    maxLength: {
                        value: 55,
                        message: "הכותרת יכולה להכיל עד 55 תווים"
                    },
                    pattern: {
                        value: /^[\p{L}\p{N}\p{P}\s]+$/u,
                        message: "בלי מקשים מיוחדים בבקשה"
                    }

                })}
            />
            {errors.title && (
                <span className={styles.errorMessage}>{errors.title.message}</span>
            )}

            <TextareaAutosize
                className={styles.bodyEdit}
                minRows={3}
                defaultValue={body}
                onChange={(e) => setBody(e.target.value)}
                {...register("body", {
                    required: "בדיחה בלי בדיחה בדרך כלל לא מצחיקה",
                    maxLength: {
                        value: 300,
                        message: "גוף הבדיחה יכול להכיל עד 300 תווים"
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

            {submitError && submitError}

            <div className={styles.ButtonGroup}>
                <DefaultButton
                    type='submit'
                    variant='teal'>
                    {isSubmitting ? 'שומר...' : 'שמור'}
                </DefaultButton >

                <div style={{ width: "20px" }}></div>

                <DefaultButton
                    variant='black'
                    onClick={cancelEdit}
                    disabled={isSubmitting}
                >
                    בטל
                </DefaultButton>

            </div>

        </form>


    )
}