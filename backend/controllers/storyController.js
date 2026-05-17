import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Story from "../models/Story.js";
import CitizenFeed from "../models/CitizenFeed.js";
import { inngest } from "../inngest/index.js";

//add user-Citizen story
export const addUserStory = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, media_type, background_color } = req.body;
    const media = req.file;
    let media_url = "";

    //upload media to imagekit
    if (media_type === "image" || media_type === "video") {
      const fileBuffer = fs.readFileSync(media.path);
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: media.originalname,
      });
      media_url = response.url;
    }
    // create story
    const story = await Story.create({
      user: userId,
      content,
      media_url,
      media_type,
      background_color,
    });
    //shedule story deletion after 24 hours
    await inngest.send({
      name: "app/story.delete",
      data: { storyId: story._id },
    });

    //response
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//get user stories list
export const getStories = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await CitizenFeed.findById(userId);

    //user
    const userIds = [userId];

    const stories = await Story.find({
      user: { $in: userIds },
    })
      .populate("user")
      .sort({ createdAt: -1 });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
