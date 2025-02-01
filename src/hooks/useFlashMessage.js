"use client";
import { useEffect, useState } from 'react';

export const useFlashMessage = (key) => {
    const [message, setMessage] = useState(false);

    useEffect(() => {
        const flash = sessionStorage.getItem(key);
        if (flash) {
            setMessage(true);
            sessionStorage.removeItem(key);
        }
    }, [key]);

    const clearMessage = () => setMessage(false);

    return [message, clearMessage];
};
