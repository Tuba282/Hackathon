import User from '../models/User.js';
import Answer from '../models/Answer.js';
import Question from '../models/Question.js';
// Get all stats for questions, users, and answers
export const getAllStats = async (req, res) => {
  try {
    // General stats
    const totalQuestions = await Question.countDocuments();
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const totalAnswers = await Answer.countDocuments();

    // Questions by public/private
    const publicQuestions = await Question.countDocuments({ isPublic: true });
    const privateQuestions = await Question.countDocuments({ isPublic: false });

    // Per-user question counts
    const questionCounts = await Question.aggregate([
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          email: "$user.email",
          questionCount: "$count"
        }
      }
    ]);

    // Per-user answer counts (admin answers)
    const answerCounts = await Answer.aggregate([
      {
        $group: {
          _id: "$adminId",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          adminId: "$user._id",
          name: "$user.name",
          email: "$user.email",
          answerCount: "$count"
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: "All stats and per-user question/answer counts fetched successfully",
      stats: {
        totalQuestions,
        totalAnswers,
        totalUsers,
        verifiedUsers,
        publicQuestions,
        privateQuestions,
        questionCountsPerUser: questionCounts,
        answerCountsPerAdmin: answerCounts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get all stats", error: error.message });
  }
};

// Get all questions (public/private)
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate('userId', 'username');
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Fetched all questions successfully',
      data: questions
    });
  } catch (err) {
    res.status(500).json({ status: 500, success: false, message: 'Failed to fetch questions', error: err.message });
  }
};

// Delete any question
export const deleteAnyQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ status: 404, success: false, message: 'Question not found' });
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Question deleted successfully',
      data: question
    });
  } catch (err) {
    res.status(500).json({ status: 500, success: false, message: 'Failed to delete question', error: err.message });
  }
};

