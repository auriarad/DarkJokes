import styles from "@/styles/loading.module.css"

export default function LoadingPage() {
    return (
        <div className={styles.container}>
            <div className={styles.spinner}></div>
        </div>
    )
}