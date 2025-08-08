import express from 'express';
import { middlewareToProtect } from '../middleware/authMiddleware.js';
import { profile, updateProfile, logout } from '../controllers/userController.js';

const router = express.Router();

// View user profile
router.get('/profile', middlewareToProtect, profile);

// Update user profile 
router.put('/updateProfile', middlewareToProtect, updateProfile);

// Logout user
router.post('/logout', middlewareToProtect, logout);

export default router;