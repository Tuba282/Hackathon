
import express from 'express';
import { upload_image_contoller } from '../controllers/uploadController.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();
// upload image (use multer middleware for file upload)
router.post('/', upload.single('file'), upload_image_contoller);



export default router;
