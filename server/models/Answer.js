import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true

    },
    answerText: {
        type: String,
        required: true
    },

    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    }
}, {
  timestamps: true
});

export default mongoose.model('Answer', answerSchema);