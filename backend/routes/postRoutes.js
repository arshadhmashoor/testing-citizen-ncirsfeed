import express from "express";
import { upload } from "../configs/multer.js";
import { protect } from "../middlewares/auth.js";
import {
  addPost,
  getFeedPosts,
  votePost,
  getMyPosts,
} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.post("/add", protect, upload.array("images", 5), addPost);
postRouter.get("/feed", protect, getFeedPosts);
postRouter.post("/vote", protect, votePost);
postRouter.get("/myposts", protect, getMyPosts);

export default postRouter;
