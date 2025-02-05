import styles from '@/styles/footer.module.css';
import Link from 'next/link';
export default function Footer() {
    return (
        <footer className={styles.footer}>
            <small>אמא שלך כל כך שמנה שכל הזכויות שמורות לה© {new Date().getFullYear()}</small>
            <div>
                <small>נחשפת באתר לתוכן פוגעני או בלתי הולם?</small>
                <br />
                <Link href={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}>דווח</Link>
            </div>
        </footer>
    );
}
