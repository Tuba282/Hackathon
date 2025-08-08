import express from 'express';
import { middlewareToProtect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multer.js';
import { profile, updateProfile, logout } from '../controllers/userController.js';
import { upload_image_contoller } from '../controllers/uploadController.js';

const router = express.Router();

// View user profile
router.get('/profile', middlewareToProtect, profile);

// Update user profile 
router.put('/updateProfile', middlewareToProtect, updateProfile);

// Logout user
router.post('/logout', middlewareToProtect, logout);

export default router;