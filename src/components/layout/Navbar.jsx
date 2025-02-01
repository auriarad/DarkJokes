'use client';
import styles from '@/styles/navbar.module.css';
import { useState } from 'react';
import AdminLoginModal from '@/components/ui/AdminLoginModal';
import { AddNewButton, RandomButton, AdminLoginButton, HomeButton, AdminPageLink, AdminLogoutButton } from '../ui/NavBarButtons';
import useAdmin from '@/hooks/useAdmin';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { isAdmin, loading, reCheck } = useAdmin();

    const router = useRouter();
    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', {
                method: 'POST',
                credentials: 'include',
            });

            reCheck(curr => !curr);
            router.push('/');

        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className={styles.navbar}>
            <div>
                <HomeButton />
                <AddNewButton />
                <RandomButton />
            </div>

            <div className="admin-section">
                {loading ? (
                    <div style={{ opacity: 0 }}>Loading...</div>
                ) : isAdmin ? (
                    <div>
                        <AdminPageLink />
                        <AdminLogoutButton func={handleLogout} />
                    </div>
                ) : (
                    <AdminLoginButton func={() => setShowLoginModal(true)}></AdminLoginButton>
                )}
            </div>

            {showLoginModal && (
                <AdminLoginModal onClose={() => setShowLoginModal(false)} />
            )}
        </nav>
    );
}
