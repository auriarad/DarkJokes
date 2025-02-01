'use client';
import styles from '@/styles/DefaultButton.module.css';

/*variants: blue,orange, steel,purple,teal,black*/

export default function DefaultButton({
    children, onClick,
    disabled = false, type = 'button',
    variant = 'blue' }) {
    return (
        <button
            disabled={disabled}
            type={type}
            className={`${styles.button} ${styles[variant]}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
