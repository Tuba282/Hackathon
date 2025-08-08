import mongoose from "mongoose";

const hijabStyleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  image: String,
  averageRating: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("hijabStyle", hijabStyleSchema);