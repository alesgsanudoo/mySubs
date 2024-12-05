import mongoose from 'mongoose';

const Session = new mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
        required: true,
    },
});


Session.index({ userID: 1, token: 1 }, { unique: true });

export default mongoose.models.Session || mongoose.model('Session', Session);
