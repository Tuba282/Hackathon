import express from 'express';
import { middlewareToProtect } from '../middleware/authMiddleware.js';
import { getMyQuestions, addQuestion, updateQuestion, deleteOwnQuestion } from '../controllers/userQuestionController.js';
import { getAnswersForQuestion } from '../controllers/userAnswerController.js';

const router = express.Router();

// Questions (user)
router.get('/getMy', middlewareToProtect, getMyQuestions);//✔️ ✔️
router.post('/add', middlewareToProtect, addQuestion);//✔️ ✔️
router.put('/update/:questionId', middlewareToProtect, updateQuestion);//✔️ 
router.delete('/delete/:questionId', middlewareToProtect, deleteOwnQuestion);//✔️

// Answers (user)
router.get('/answers/:questionId', middlewareToProtect, getAnswersForQuestion);//✔️--

export default router;
