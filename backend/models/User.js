import mongoose from "mongoose";

const user_c_Schema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    email: { type: String, unique: true },
    full_name: { type: String, required: true },
    username: { type: String, unique: true },
    bio: { type: String, default: "let's use ncirs" },
    profile_picture: { type: String, default: "" },
    cover_photo: { type: String, default: "" },
    location: { type: String, default: "" },
  },
  { timeseries: true, minimize: false }
);

const User = mongoose.model("User", user_c_Schema);

export default User;
