import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  hijabStyle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HijabStyle"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  text: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
