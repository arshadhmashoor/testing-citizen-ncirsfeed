import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    // Reporter — Clerk userId string (matches existing CitizenFeed pattern)
    user: { type: String, ref: "CitizenFeed", required: true },

    // Core issue fields
    title: { type: String, default: "" },
    desc: { type: String, default: "" },

    // Status lifecycle — matches issues DB snapshots
    status: {
      type: String,
      enum: ["pending", "assigned", "in_progress", "resolved", "rejected"],
      default: "pending",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    location: { type: String, default: "" },

    // Category — stored as name string (from UI selection); can be ref later
    category: { type: String, default: "" },
    subCategory: { type: String, default: "" },

    // Image URLs uploaded via ImageKit (same pattern as original Post.js)
    image_urls: [{ type: String }],

    // AI suggested department name (string, as seen in issues DB snapshot)
    aiSuggestedDepartment: { type: String, default: "" },

    // Assignment tracking — matches issues DB fields
    assignedDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Officer",
      default: null,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Officer",
      default: null,
    },
    assignedAt: { type: Date, default: null },

    // Voting (retained from original Post.js for feed interactions)
    votes_count: [{ type: String, ref: "CitizenFeed" }],
  },
  { timestamps: true, minimize: false }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
