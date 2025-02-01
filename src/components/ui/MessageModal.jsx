"use client";
import { useEffect } from 'react';
import styles from '@/styles/modal.module.css';
import { useFlashMessage } from '@/hooks/useFlashMessage';
import { X } from 'lucide-react';


export const MessageModal = ({ children, message }) => {
    const [showModal, clearMessage] = useFlashMessage(message);

    useEffect(() => {
        const timer = setTimeout(() => {
            clearMessage();
        }, 5000);

        return () => clearTimeout(timer);
    }, [clearMessage]);

    const outPressed = (e) => {
        if (e.target.id === 'overlay') {
            clearMessage();
        }
    }

    if (showModal) {
        return (
            <div id='overlay' onClick={outPressed} className={styles.modalOverlay}>
                <div className={styles.modalContent}>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            clearMessage();
                        }}
                        className={styles.modalClose}
                    >
                        <X size={20} />
                    </button>

                    {children}
                </div>
            </div>
        );
    } else {
        return <></>
    }
};
