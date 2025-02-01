import mongoose from 'mongoose';
import { categories } from '../../public/categories';

const jokeSchema = new mongoose.Schema({
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
    rating: {
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
    createdAt: {
        type: Date,
        default: Date.now,
    },

    //   approved: {
    //     type: Boolean,
    //     default: false,
    //   },
});




export default mongoose.models.Joke || mongoose.model('Joke', jokeSchema);
