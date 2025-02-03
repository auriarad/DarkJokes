'use client';
import { useState } from 'react';
import styles from '@/styles/DefaultButton.module.css';
import useLongPress from '@/hooks/useLongPress';

export default function DefaultButton({
    children,
    onClick,
    onLongPress,
    disabled = false,
    type = 'button',
    variant = 'blue',
    style
}) {
    const [isPressed, setIsPressed] = useState(false);

    if (!onClick) {
        onClick = () => { };
    }
    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 2000,
    };
    const longPressEvent = onLongPress ? useLongPress(onLongPress, onClick, defaultOptions) : null;

    const buttonEvents = onLongPress ? {
        ...longPressEvent,
        onMouseDown: (e) => {
            longPressEvent.onMouseDown(e);
            setIsPressed(true);
        },
        onMouseUp: (e) => {
            longPressEvent.onMouseUp(e);
            setIsPressed(false);
        },
        onMouseLeave: (e) => {
            longPressEvent.onMouseLeave(e);
            setIsPressed(false);
        },
        onTouchStart: (e) => {
            longPressEvent.onTouchStart(e);
            setIsPressed(true);
        },
        onTouchEnd: (e) => {
            longPressEvent.onTouchEnd(e);
            setIsPressed(false);
        },
    } : {
        onClick: onClick
    };

    return (
        <button
            style={style}
            {...buttonEvents}
            disabled={disabled}
            type={type}
            className={`${styles.button} ${styles[variant]} ${isPressed && onLongPress ? styles.pressing : ''}`}
        >
            <div className={styles.buttonContent}>
                {children}
            </div>
            {onLongPress && (
                <div className={`${styles.progressRing} ${isPressed ? styles.animate : ''}`} />
            )}
        </button>
    );
}

