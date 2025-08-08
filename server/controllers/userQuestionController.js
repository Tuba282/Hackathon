import Question from '../models/Question.js';

// Add a question
export const addQuestion = async (req, res) => {
  try {
    const { title, description , isPublic } = req.body;
    const question = new Question({
      title,
      description,
      isPublic,
      userId: req.user.id
    });
    await question.save();
    res.status(201).json({
      status: 201,
      success: true,
      message: 'Question added successfully',
      data: question
    });
  } catch (err) {
    res.status(500).json({ status: 500, success: false, message: 'Failed to add question', error: err.message });
  }
};

// Get my questions
export const getMyQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ userId: req.user.id });
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Fetched user questions successfully',
      data: questions
    });
  } catch (err) {
    
    res.status(500).json({ status: 500, success: false, message: 'Failed to fetch questions', error: err.message });
  }
};

// Edit own question
export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findOneAndUpdate(
      { _id: req.params.questionId, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!question) return res.status(404).json({ status: 404, success: false, message: 'Not found or not authorized' });
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Question updated successfully',
      data: question
    });
  } catch (err) {
    res.status(500).json({ status: 500, success: false, message: 'Failed to update question', error: err.message });
  }
};

// Delete own question
export const deleteOwnQuestion = async (req, res) => {
  try {
    const question = await Question.findOneAndDelete({ _id: req.params.questionId, userId: req.user.id });
    if (!question) return res.status(404).json({ status: 404, success: false, message: 'Not found or not authorized' });
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