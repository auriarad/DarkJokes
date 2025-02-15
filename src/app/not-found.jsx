import styles from '@/styles/NotFound.module.css'

export default function NotFound() {
    return (
        <div className={styles.notFound}>
            <div className={styles.videoContainer}>
                <video autoPlay loop muted className={styles.video}>
                    <source src="/suprisedBlack.webm" type="video/webm" />
                    אחי תעבור לכרום ותראה את הסרטון כבר
                </video>
            </div>
            <h1>404</h1>
            <h2>נראה כאילו ניסית להתחכם</h2>
            <p>לך חפש משהו אחר אולי תמצא</p>
        </div>
    )
}