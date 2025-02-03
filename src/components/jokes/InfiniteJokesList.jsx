'use client';
import InfiniteScroll from 'react-infinite-scroll-component';
import { JokeCard } from './JokeCard';
import { LoadingDots } from '../ui/LoadingDots';

export default function InfiniteJokesList({ jokes, hasMore, fetchMoreJokes, noFound }) {

    return (
        <div>
            <InfiniteScroll
                dataLength={jokes.length}
                next={fetchMoreJokes}
                hasMore={hasMore}
                loader={<LoadingDots />}
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
