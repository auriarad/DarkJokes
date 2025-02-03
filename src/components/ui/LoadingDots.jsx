import styles from '@/styles/LoadingDots.module.css';

export const LoadingDots = () => {
    return (
        <div className={styles.dots}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
        </div>
    );
};

