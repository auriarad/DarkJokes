'use client';

import InfiniteJokesList from '@/components/jokes/InfiniteJokesList';
import SideBar from '@/components/layout/SideBar';
import { useState } from 'react';

export default function JokeList({ initialJokes }) {
    const [jokes, setJokes] = useState(initialJokes);
    const [hasMore, setHasMore] = useState(true);
    const [noFound, setNoFounds] = useState(false);
    const [searchData, setSearchData] = useState({ search: '', sort: '_id', sortOrder: 'descending', chosenCategories: [] })

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
        const { search, sort = '_id', sortOrder, chosenCategories } = data;
        const res = await fetch(`/api/jokes?search=${search}&sort=${sort}&sortOrder=${sortOrder}&categories=${chosenCategories.join(',')}`)
        const newInitialJokes = await res.json();
        if (newInitialJokes.length === 0) {
            setJokes(newInitialJokes);
            setNoFounds(true);
            setHasMore(false);
        } else {
            setJokes(newInitialJokes);
            setNoFounds(false);
            setHasMore(true);
            setSearchData({ search, sort, sortOrder, chosenCategories })
        }

    }

    return (
        <section style={{ display: "flex", flexDirection: "row" }}>
            <SideBar handleSearch={handleSearch} />
            <InfiniteJokesList
                jokes={jokes}
                hasMore={hasMore}
                fetchMoreJokes={fetchMoreJokes}
                noFound={noFound}
            />
        </section>

    )
}