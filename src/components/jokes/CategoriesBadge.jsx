import Link from 'next/link';
import styles from '@/styles/badge.module.css';

export default function CategoryBadge({ children, varinat = "default" }) {
    return (
        <span className={`${styles.badge} ${styles[varinat]}`}>
            {children}
        </span>
    );
}
