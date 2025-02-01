'use client';
import { useEffect, useState } from 'react';

export default function useAdmin() {
    const [isAdmin, setIsAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [check, reCheck] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/admin/check-auth');
                const { isAdmin } = await res.json();
                setIsAdmin(isAdmin);
            } finally {
                setLoading(false);
            }
        };
        console.log('a');
        checkAuth();
    }, [check]);

    return { isAdmin, loading, reCheck };
}
