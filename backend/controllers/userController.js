// import path from "path";
import imagekit from "../configs/imageKit.js";
import CitizenFeed from "../models/CitizenFeed.js";
import fs from "fs";
//function to get and update user /citizen data

//get user data using userId
export const getUserData = async (req, res) => {
  try {
    //const { userId } = req.auth();
    //temprarity use the below instead of req.auth
    //const userId = "user_3DhJ6sjyQ1kidbGtuQL7rs3Ymu4";
    const userId = req.userId;
    const user = await CitizenFeed.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//update user data
export const updateUserData = async (req, res) => {
  try {
    // const { userId } = req.auth();
    const userId = req.userId;
    let { username, bio, location, full_name } = req.body;

    const tempUser = await CitizenFeed.findById(userId);

    !username && (username = tempUser.username);

    if (tempUser.username !== username) {
      const user = await CitizenFeed.findOne({ username });
      if (user) {
        // username wont b changed if its already taken
        username = tempUser.username;
      }
    }

    const updatedData = {
      username,
      bio,
      location,
      full_name,
    };

    //updation of images
    const profile = req.files.profile && req.files.profile[0];
    const cover = req.files.cover && req.files.cover[0];

    if (profile) {
      const buffer = fs.readFileSync(profile.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
      });

      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "512" },
        ],
      });
      updatedData.profile_picture = url;
    }

    //cover image
    if (cover) {
      const buffer = fs.readFileSync(cover.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: cover.originalname,
      });

      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
      updatedData.cover_photo = url;
    }
    //save photos in db
    const user = await CitizenFeed.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    res.json({ success: true, user, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//find users using username, email, location, name
export const discoverUsers = async (req, res) => {
  try {
    // const { userId } = req.auth();
    const userId = req.userId;
    const { input } = req.body;

    const allUsers = await CitizenFeed.find({
      $or: [
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    });
    const filteredUsers = allUsers.filter((user) => user._id !== userId);

    res.json({ success: true, users: filteredUsers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
