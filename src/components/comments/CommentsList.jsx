'use client';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from '@/styles/CommentsList.module.css'
import { Trash2 } from 'lucide-react';
import useAdmin from '@/hooks/useAdmin';
import { LoadingDots } from '../ui/LoadingDots';

export default function CommentsList({
    comments, hasMore, fetchMorecomments,
    endMessage, clientId, handleDelete,
    isDeleting, deleteError }) {
    const { isAdmin } = useAdmin()
    return (
        <div>
            <InfiniteScroll
                dataLength={comments.length}
                next={fetchMorecomments}
                hasMore={hasMore}
                loader={<LoadingDots />}
                endMessage={endMessage()}
                scrollThreshold={0.95}
            >
                {comments.map((comment) => (
                    <div className={styles.commentCard} key={comment._id}>
                        <div className={styles.cardTitle}>
                            <h2 className={styles.commentName}>- {comment.name}</h2>
                            {(clientId === comment.clientId || isAdmin) && (
                                <button
                                    onClick={() => handleDelete(comment._id)}
                                    className={styles.trashBtn}
                                    disabled={isDeleting}
                                >
                                    <Trash2 />
                                </button>
                            )}

                        </div>
                        <p className={styles.commentBody}>{comment.body}</p>
                        {(deleteError.comment === comment._id && deleteError.error) && (
                            <p className={styles.errorMessage}>{deleteError.error}</p>
                        )}
                    </div>
                ))}
            </InfiniteScroll>
        </div >
    );
}
