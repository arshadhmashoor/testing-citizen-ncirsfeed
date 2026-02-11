import mongoose from "mongoose";

const aiProcessingSchema = new mongoose.Schema({
  issueID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue",
    required: true
  },
  keywords: [String],
  categoryScore: [
    {
      category: String,
      score: Number
    }
  ]
}, { timestamps: true });

export default mongoose.model("AIProcessing", aiProcessingSchema);
