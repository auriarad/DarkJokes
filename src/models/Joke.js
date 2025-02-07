import mongoose from 'mongoose';
import { categories } from '../../public/categories';
import Comment from './comment';
const { Schema } = mongoose;

const jokeSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    categories: {
        type: [String],
        required: true,
        enum: categories
    },
    ratingUp: {
        type: Number,
        default: 0,
    },
    ratingDown: {
        type: Number,
        default: 0,
    },
    voters: [
        {
            clientId: String,
            voteType:
            {
                type: String,
                enum: ['up', 'down']
            }
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },

    approved: {
        type: Boolean,
        default: false,
    },
    approvedBy: {
        type: String,
        required: true
    }
});

jokeSchema.post('findOneAndDelete', async function (joke) {
    if (joke.comments.length) {
        await Comment.deleteMany({ _id: { $in: joke.comments } })
    }
})

export default mongoose.models.Joke || mongoose.model('Joke', jokeSchema);
