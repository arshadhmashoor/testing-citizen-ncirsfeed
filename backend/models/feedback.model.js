import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  issueID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue",
    required: true
  },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Feedback", feedbackSchema);
