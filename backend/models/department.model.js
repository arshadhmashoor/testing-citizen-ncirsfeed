import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ministry: String,
  contact: String,
  jurisdiction: String,
  minister: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Minister"
  }
});

export default mongoose.model("Department", departmentSchema);
