import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    clientId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});




export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
