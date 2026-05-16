import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: String, ref: "CitizenFeed", required: true },
    content: { type: String },
    image_urls: [{ type: String }],
    post_type: {
      type: String,
      enum: ["text", "image", "text_with_image"],
      required: true,
    },
    votes_count: [{ type: String, ref: "CitizenFeed" }],
  },
  { timestamps: true, minimize: false }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;

// import mongoose from "mongoose";

// const postSchema = new mongoose.Schema(
//   {
//     user: { type: String, ref: "CitizenFeed", required: true },
//     content: { type: String },
//     image_urls: [{ type: String }],
//     post_type: {
//       type: String,
//       enum: ["text", "image", "text_with_image"],
//       required: true,
//     },
//     location: { type: String, default: "" },
//     votes_count: [{ type: String, ref: "CitizenFeed" }],
//   },
//   { timestamps: true, minimize: false }
// );

// const Post = mongoose.model("Post", postSchema);

// export default Post;
