import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "assigned", "in_progress", "resolved", "rejected"],
    default: "pending"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  location: String,
  images: [String],

  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Citizen",
    required: true
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Officer"
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
}, { timestamps: true });

export default mongoose.model("Issue", issueSchema);
