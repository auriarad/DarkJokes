import styles from '@/styles/dynamicRating.module.css'
export const DynamicRating = ({ ratingUp, ratingDown, handleVote, vote, size = 1 }) => {

    return (
        <div style={{ scale: size }} className={styles.container}>
            <small style={{ color: "gray" }}>({ratingUp})</small>
            <div onClick={(e) => handleVote(e, "up")} className={`${styles.voteButton} ${styles.upVote}`}>
                {vote === "up" ?
                    <svg className={styles.fullUpVote} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z" /></svg>
                    :
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z" /></svg>
                }
            </div>
            <p>{ratingUp - ratingDown}</p>
            <div onClick={(e) => handleVote(e, "down")} className={`${styles.voteButton} ${styles.downVote}`}>
                {vote === "down" ?
                    <svg className={styles.fullDownVote} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059z" /></svg>
                    :
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059zM12 19.399 6.081 12H10V4h4v8h3.919L12 19.399z" /></svg>
                }
            </div>
            <small style={{ color: "gray" }}>({ratingDown})</small>
        </div>
    )
}