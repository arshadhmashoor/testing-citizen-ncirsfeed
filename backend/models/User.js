import mongoose from "mongoose";

const usercSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    email: { type: String, unique: true },
    full_name: { type: String, required: true },
    username: { type: String, unique: true },
    bio: { type: String, default: "hey, i am using ncirs" },
    profile_picture: { type: String, default: "" },
    cover_photo: { type: String, default: "" },
    location: { type: String, default: "" },
  },
  { timeseries: true, minimize: false }
);

const User = mongoose.model("User", usercSchema);

export default User;
