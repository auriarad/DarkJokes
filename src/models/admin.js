import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    sessionToken: {
        type: String
    }
});


export default mongoose.models.Admin || mongoose.model('Admin', adminSchema);
