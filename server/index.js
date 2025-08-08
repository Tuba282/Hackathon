import express from 'express';
import dbConnection from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadFile from './routes/common.js';
import userRoutes from './routes/userRoutes.js';
import fileUpload from 'express-fileupload';
import adminQuestionRoutes from './routes/admin_Ques_Ans_Routes.js';
import userQuestionRoutes from './routes/user_Ques_Ans_Routes.js';

// Load environment variables
dotenv.config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

app.use(fileUpload({
    useTempFiles: true
}))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/auth', userRoutes)
app.use('/api/auth', adminRoutes)
app.use('/api/upload', uploadFile)
app.use('/api/admin/quries', adminQuestionRoutes)
app.use('/api/user/quries', userQuestionRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Auth Server is running!' });
});

// Database connection
dbConnection()


app.use(cors({
  origin: 'http://localhost:3001/', 
  credentials: true 
}));



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

