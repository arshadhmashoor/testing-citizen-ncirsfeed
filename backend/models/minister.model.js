import mongoose from "mongoose";

const ministerSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  ministryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ministry"
  },
  jurisdiction: String
});

export default mongoose.model("Minister", ministerSchema);
