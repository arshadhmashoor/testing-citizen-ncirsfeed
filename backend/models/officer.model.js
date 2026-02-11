import mongoose from "mongoose";

const officerSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  departmentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },
  badgeNo: { type: String, unique: true },
  authority: String
});

export default mongoose.model("Officer", officerSchema);
