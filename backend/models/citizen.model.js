import mongoose from "mongoose";

const citizenSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  verified: { type: Boolean, default: false },
  joinDate: { type: Date, default: Date.now }
});

export default mongoose.model("Citizen", citizenSchema);
