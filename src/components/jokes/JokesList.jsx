'use client';

import InfiniteJokesList from '@/components/jokes/InfiniteJokesList';
import SideBar from '@/components/layout/SideBar';
import { useState, useRef } from 'react';
import styles from "@/styles/homePage.module.css"
import { LoadingDots } from '../ui/LoadingDots';

export default function JokeList({ initialJokes }) {
    const [jokes, setJokes] = useState(initialJokes);
    const [hasMore, setHasMore] = useState(true);
    const [noFound, setNoFounds] = useState(false);
    const [searchData, setSearchData] = useState({ search: '', sort: '_id', sortOrder: 'descending', chosenCategories: [] })
    const [isLoading, setIsLoading] = useState(false);
    const latestSearchRef = useRef(null);

    const fetchMoreJokes = async () => {
        const res = await fetch(`/api/jokes?skip=${jokes.length}&search=${searchData.search}&sort=${searchData.sort}&sortOrder=${searchData.sortOrder}&categories=${searchData.chosenCategories.join(',')}`)

        const newJokes = await res.json();

        if (newJokes.length === 0) {
            setHasMore(false);
        } else {
            setJokes([...jokes, ...newJokes]);
        }
    };

    const handleSearch = async (data) => {
        const currentSearchId = {};
        latestSearchRef.current = currentSearchId;
        try {
            setIsLoading(true);
            const { search, sort = '_id', sortOrder, chosenCategories } = data;
            const res = await fetch(`/api/jokes?search=${search}&sort=${sort}&sortOrder=${sortOrder}&categories=${chosenCategories.join(',')}`)
            const newInitialJokes = await res.json();

            // Only update if this is still the latest search
            if (latestSearchRef.current === currentSearchId) {
                if (newInitialJokes.length === 0) {
                    setJokes(newInitialJokes);
                    setNoFounds(true);
                    setHasMore(false);
                } else {
                    setJokes(newInitialJokes);
                    setNoFounds(false);
                    setHasMore(true);
                    setSearchData({ search, sort, sortOrder, chosenCategories });
                }
                setIsLoading(false);
            }
        } catch (error) {
            if (latestSearchRef.current === currentSearchId) {
                setIsLoading(false);
                console.error('Search error:', error);
            }
        }
    }


    return (
        <section className={styles.section}>
            <SideBar handleSearch={handleSearch} />

            {isLoading ? <LoadingDots /> : (
                <div className={styles.InfiniteJokesList}>
                    <InfiniteJokesList
                        jokes={jokes}
                        hasMore={hasMore}
                        fetchMoreJokes={fetchMoreJokes}
                        noFound={noFound}
                    />
                </div>
            )}
        </section>

    )
}