"use client";
import styles from '@/styles/Form.module.css';
import { useForm } from 'react-hook-form';
import MultiSelect from '../ui/MultiSelect';
import { categories } from '../../../public/categories';
import DefaultButton from '../ui/DefaultButton';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const NewForm = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const response = await fetch('/api/jokes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('אופס.. נראה שיש תקלה :( תנסה בבקשה שוב');
            }

            const responseData = await response.json()

            if (!responseData.admin) {
                sessionStorage.setItem('jokeSubmissionSuccess', 'true');
            }
            router.push('/');
        } catch (error) {
            setSubmitError('אופס... נראה שיש תקלה :( תנסה בבקשה שוב');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formRow}>
                <label htmlFor="title">כותרת\פתיח הבדיחה</label>
                <input
                    id='title'
                    type="text"
                    placeholder="איש אחד הלך הלך הלך"
                    className={`${styles.input} ${errors.title ? styles.errorInput : ''}`}
                    {...register("title", {
                        required: "סליחה אחי חייב כותרת",
                        maxLength: {
                            value: 55,
                            message: "הכותרת יכולה להכיל עד 55 תווים"
                        },
                        pattern: {
                            value: /^[\p{L}\p{N}\s]+$/u,
                            message: "בלי מקשים מיוחדים בבקשה"
                        }

                    })}
                />
                {errors.title && (
                    <span className={styles.errorMessage}>{errors.title.message}</span>
                )}
            </div>

            <div className={styles.formRow}>
                <label htmlFor="body">גוף הבדיחה</label>
                <textarea
                    id='body'
                    placeholder="בום שניצל"
                    className={`${styles.textarea} ${errors.body ? styles.errorInput : ''}`}
                    {...register("body", {
                        required: "בדיחה בלי בדיחה בדרך כלל לא מצחיקה",
                        maxLength: {
                            value: 300,
                            message: "גוף הבדיחה יכול להכיל עד 300 תווים"
                        },
                        pattern: {
                            value: /^[\p{L}\p{N}\s]+$/u,
                            message: "בלי מקשים מיוחדים בבקשה"
                        }
                    })}
                />
                {errors.body && (
                    <span className={styles.errorMessage}>{errors.body.message}</span>
                )}
            </div>

            <div className={styles.formRow}>
                <label htmlFor="categories">בחר 1-3 קטגוריות</label>
                <MultiSelect
                    name="categories"
                    control={control}
                    options={categories}
                    rules={{
                        required: 'בבקשה תבחר לפחות קטגוריה אחת',
                        validate: {
                            maxLength: (value) => value.length <= 3 || 'ניתן לבחור עד 3 קטגוריות בלבד'
                        }
                    }}
                />
                {errors.categories && (
                    <span className={styles.errorMessage}>{errors.categories.message}</span>
                )}
            </div>

            {submitError && (
                <div style={{ marginBottom: "10px" }} className={styles.errorMessage}> <p style={{ fontSize: "1.15em" }}>{submitError}</p></div>
            )}

            <DefaultButton
                style={{ margin: "auto" }}
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'שולח...' : 'שלח בדיחה'}
            </DefaultButton>

        </form>
    );
}
