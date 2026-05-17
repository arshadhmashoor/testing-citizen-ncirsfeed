import express from "express";
import { upload } from "../configs/multer.js";
import { protect } from "../middlewares/auth.js";
import {
  addPost,
  getFeedPosts,
  votePost,
} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.post("/add", upload.array("images", 4), addPost);
postRouter.get("/feed", getFeedPosts);
postRouter.post("/vote", protect, votePost);

export default postRouter;
