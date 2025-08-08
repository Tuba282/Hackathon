import express from 'express';
import { deleteAnyQuestion, getAllQuestions, getAllStats } from '../controllers/adminQuestionController.js';
import { addAnswer, deleteAnyAnswer, getAllAnswers } from '../controllers/adminAnswerController.js';
import { middlewareToProtect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// give Answers (admin)
router.post('/answers/:questionId', middlewareToProtect, isAdmin, addAnswer);//✔️--


// Questions (admin)
router.get('/all', getAllQuestions);//✔️
router.delete('/delete/:questionId', middlewareToProtect, isAdmin, deleteAnyQuestion);//✔️
router.get('/stats', middlewareToProtect, isAdmin, getAllStats);//✔️

// Answers (admin)
router.get('/answers', getAllAnswers);//✔️
router.delete('/answers/:answerId', middlewareToProtect, isAdmin, deleteAnyAnswer);//✔️--

export default router;
