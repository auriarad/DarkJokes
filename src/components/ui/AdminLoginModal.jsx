'use client';
import { useForm } from 'react-hook-form';
import DefaultButton from './DefaultButton';
import styles from '@/styles/modal.module.css';
import formStyles from '@/styles/Form.module.css'
import { X } from 'lucide-react';

export default function AdminLoginModal({ onClose }) {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => {
        console.log(data);
    }

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
                            })}
                        />
                        {errors.username && (
                            <span className={formStyles.errorMessage}>{errors.username.message}</span>
                        )}
                    </div>

                    <div className={formStyles.formRow}>
                        <label htmlFor="password">גוף הבדיחה</label>
                        <input
                            id='password'
                            placeholder="12345678"
                            className={`${formStyles.input} ${errors.password ? formStyles.errorInput : ''}`}
                            {...register("password", {
                                required: "איך תתחבר בלי ססמא יה מפגר",
                            })}
                        />
                        {errors.password && (
                            <span className={formStyles.errorMessage}>{errors.password.message}</span>
                        )}
                    </div>
                    <DefaultButton type="submit" variant='steel'>התחבר</DefaultButton>

                </form>
            </div>
        </div>
    );
}
