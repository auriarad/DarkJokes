'use client';
import InfiniteScroll from 'react-infinite-scroll-component';
import { JokeCard } from './JokeCard';

export default function InfiniteJokesList({ jokes, hasMore, fetchMoreJokes, noFound }) {

    return (
        <div style={{ width: "80%" }}>
            <InfiniteScroll
                dataLength={jokes.length}
                next={fetchMoreJokes}
                hasMore={hasMore}
                loader={<p>Loading...</p>}
                endMessage={noFound ? <p>נראה כאילו החיפוש שלך חרה</p> : <p>זהו! אין עוד</p>}
                scrollThreshold={0.95}
            >
                {jokes.map((joke) => (
                    <JokeCard key={joke._id} joke={joke} />
                ))}
            </InfiniteScroll>
        </div >
    );
}
