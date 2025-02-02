'use client';

import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState } from 'react';
import { AdminJokeCard } from './AdminJokeCard';
import styles from '@/styles/AdminPage.module.css'

export default function AdminJokeList({ initialJokes }) {

    const [jokes, setJokes] = useState(initialJokes);
    const [hasMore, setHasMore] = useState(true);
    const [noFound, setNoFounds] = useState(false);
    const [noJokes, setNoJokes] = useState(false);
    const [search, setsearch] = useState('')

    useEffect(() => {
        if (!initialJokes.length) {
            setHasMore(false)
            setNoJokes(true)
        }
    }, [])

    const fetchMoreJokes = async () => {
        const res = await fetch(`/api/jokes?skip=${jokes.length}&search=${search}&approved=false`)
        const newJokes = await res.json();
        if (newJokes.length === 0) {
            setHasMore(false);
        } else {
            setJokes([...jokes, ...newJokes]);
        }
    };

    const handleSearch = async (e) => {
        const searchValue = e.target.value;
        setsearch(searchValue)
        if (noJokes) {
            return
        }

        const res = await fetch(`/api/jokes?search=${searchValue}&approved=false`)
        const newInitialJokes = await res.json();
        if (newInitialJokes.length === 0) {
            setJokes(newInitialJokes);
            setNoFounds(true);
            setHasMore(false);
        } else {
            setJokes(newInitialJokes);
            setNoFounds(false);
            setHasMore(true);
        }
    }

    const refreshAfterChange = async () => {
        const res = await fetch(`/api/jokes?search=${search}&approved=false`)
        const newInitialJokes = await res.json();
        if (newInitialJokes.length === 0) {
            setJokes(newInitialJokes);
            setNoFounds(false);
            setHasMore(false)
            setNoJokes(true)
        } else {
            setJokes(newInitialJokes);
            setNoFounds(false);
            setHasMore(true);
        }
    }
    const endMessageClc = () => {
        if (noJokes) {
            return <p>אין בדיחות שמחכות לאישור</p>
        }
        if (noFound) {
            return <p>נראה כאילו החיפוש שלך חרה</p>
        }
        return <p>זהו! אין עוד</p>
    }
    return (
        <section style={{ display: "flex", flexDirection: "column", width: '50%' }}>
            <input
                className={styles.search}
                type="text"
                onChange={handleSearch}
                value={search}
                placeholder='חפש משהו...'
            />
            <InfiniteScroll
                dataLength={jokes.length}
                next={fetchMoreJokes}
                hasMore={hasMore}
                loader={<p>Loading...</p>}
                endMessage={endMessageClc()}
                scrollThreshold={0.95}
            >
                {jokes.map((joke) => (
                    <AdminJokeCard key={joke._id} joke={joke} after={refreshAfterChange} />
                ))}
            </InfiniteScroll>
        </section>

    )
}