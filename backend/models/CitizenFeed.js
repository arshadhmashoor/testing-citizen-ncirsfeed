import mongoose from "mongoose";

const user_c_Schema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, //clerk user id
    email: { type: String, unique: true },
    full_name: { type: String, required: true },
    username: { type: String, unique: true },
    role: { type: String, default: "citizen" },
    bio: { type: String, default: "let's use ncirs" },
    profile_picture: { type: String, default: "" },
    cover_photo: { type: String, default: "" },
    location: { type: String, default: "" },
  },
  { timestamps: true, minimize: false }
);

const CitizenFeed =
  mongoose.models.CitizenFeed ||
  mongoose.model("CitizenFeed", citizenFeedSchema, "citizen_feeds");

export default CitizenFeed;
// const User = mongoose.model("User", user_c_Schema);

// export default User;

// import mongoose from "mongoose";

// const user_c_Schema = new mongoose.Schema(
//   {
//     _id: { type: String, required: true }, //clerk user id
//     email: { type: String, unique: true },
//     full_name: { type: String, required: true },
//     username: { type: String, unique: true },
//     role: { type: String, default: "citizen" },
//     bio: { type: String, default: "let's use ncirs" },
//     profile_picture: { type: String, default: "" },
//     cover_photo: { type: String, default: "" },
//     location: { type: String, default: "" },
//   },
//   { timestamps: true, minimize: false }
// );

// const User = mongoose.model("User", user_c_Schema);

// export default User;
