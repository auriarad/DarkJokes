'use client';
import { useForm } from 'react-hook-form';
import DefaultButton from './DefaultButton';
import styles from '@/styles/modal.module.css';
import formStyles from '@/styles/Form.module.css'
import { X } from 'lucide-react';
import { useState } from 'react';

export default function AdminLoginModal({ onClose }) {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loginError, setLoginError] = useState('');
    const [loading, setLoading] = useState(false);
    const textRegex = /^[\p{L}\p{N}\p{S}\p{P}\s]+$/u;

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setLoginError('')
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            const result = await response.json();
            setLoading(false)
            if (response.ok) {
                // onClose();
                window.location.reload();
            } else {
                setLoginError(result.error || 'התחברות נכשלה');
            }
        } catch (error) {
            setLoginError('נראה כאילו משהו השתבש');
        }
    };


    const outPressed = (e) => {
        if (e.target.id === 'overlay') {
            onClose();
        }
    }

    return (
        <div id='overlay' onClick={outPressed} className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.modalClose} onClick={onClose}>
                    <X />
                </button>
                <p style={{ margin: '30px 8px 0px 0px' }}>פששש מרגיש חשוב היום אה?</p>
                <h2 style={{ textAlign: "center" }}>התחברות מנהלים</h2>

                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={formStyles.formRow}>
                        <label htmlFor="username">שם משתמש</label>
                        <input
                            id='username'
                            type="text"
                            placeholder="סטפןלאגר123"
                            className={`${formStyles.input} ${errors.username ? formStyles.errorInput : ''}`}
                            {...register("username", {
                                required: "חובה שם משתמש אחי",
                                pattern: {
                                    value: /^[\p{L}\p{N}\s]+$/u,
                                    message: "בלי מקשים מיוחדים בבקשה"
                                }
                            })}
                        />
                        {errors.username && (
                            <span className={formStyles.errorMessage}>{errors.username.message}</span>
                        )}
                    </div>

                    <div className={formStyles.formRow}>
                        <label htmlFor="password">ססמא</label>
                        <input
                            id='password'
                            placeholder="12345678"
                            className={`${formStyles.input} ${errors.password ? formStyles.errorInput : ''}`}
                            {...register("password", {
                                required: "איך תתחבר בלי ססמא יה מפגר",
                                pattern: {
                                    value: /^[\p{L}\p{N}\s]+$/u,
                                    message: "בלי מקשים מיוחדים בבקשה"
                                }
                            })}
                        />
                        {errors.password && (
                            <span className={formStyles.errorMessage}>{errors.password.message}</span>
                        )}
                    </div>
                    {loginError &&
                        <span className={formStyles.errorMessage}>{loginError}</span>
                    }
                    <DefaultButton type="submit" variant='steel'>{loading ? 'מחבר...' : 'התחבר'}</DefaultButton>
                </form>
            </div>
        </div>
    );
}
