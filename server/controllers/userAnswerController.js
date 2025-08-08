import Answer from '../models/Answer.js';

// Get all answers for a question (user can view answers to their question)
import Question from '../models/Question.js';

export const getAnswersForQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ status: 404, success: false, message: 'Question not found' });
    }
    const answers = await Answer.find({ questionId: req.params.questionId }).populate('adminId', 'name email');
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Fetched answers for question successfully',
      data: answers,
      question: {
        _id: question._id,
        title: question.title,
        description: question.description
      }
    });
  } catch (err) {
    res.status(500).json({ status: 500, success: false, message: 'Failed to fetch answers', error: err.message });
  }
};