"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import styles from '@/styles/error.module.css'

export default function ErrorPage({ error, reset }) {
    const router = useRouter();
    const reload = () => {
        startTransition(() => {
            router.refresh();
            reset();
        })
    }
    const statusCode = error.status || error.statusCode ||
        (error.response && error.response.status) || 500;


    return (
        <div className={styles.error}>
            <div>
                <h1>{statusCode}</h1>
                {/* <h2>{error.message}</h2> */}
                <h2>אופס! נראה כאילו משהו השתבש (חוץ ממך יה מקולקל)</h2>
                <button
                    className={styles.btn}
                    onClick={() => reload()}
                >
                    נסה שוב אולי הפעם יעבוד
                </button>
            </div>
            <img src="/baby.png" alt="" />
        </div>
    )
}