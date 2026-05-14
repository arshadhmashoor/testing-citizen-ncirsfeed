import express from "express";
import {
  discoverUsers,
  getUserData,
  updateUserData,
} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../configs/multer.js";

const userRouter = express.Router();

//create url/api end points
userRouter.get("/data", protect, getUserData);
userRouter.get(
  "update",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  protect,
  updateUserData
);
userRouter.get("/discover", protect, discoverUsers);

export default userRouter;
