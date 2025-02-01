'use client';
import Link from 'next/link';
import styles from '@/styles/navbar.module.css';
import { useState } from 'react';
import AdminLoginModal from '@/components/ui/AdminLoginModal';
import { AddNewButton, RandomButton, AdminLoginButton, HomeButton } from '../ui/NavBarButtons';

export default function Navbar() {
    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <nav className={styles.navbar}>
            <div>
                <HomeButton />
                <AddNewButton />
                <RandomButton />
            </div>

            <div>
                <AdminLoginButton func={() => setShowLoginModal(true)}></AdminLoginButton>
            </div>

            {showLoginModal && (
                <AdminLoginModal onClose={() => setShowLoginModal(false)} />
            )}
        </nav>
    );
}
