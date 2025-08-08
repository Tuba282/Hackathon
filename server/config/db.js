import mongoose from "mongoose";
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected to DB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};


export default dbConnection