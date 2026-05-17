import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Post from "../models/Post.js";
import CitizenFeed from "../models/CitizenFeed.js";

//add post issue
export const addPost = async (req, res) => {
  try {
    const { userId } = req.auth();
    // const { userId } = req.userId;
    // const userId = "user_3DhJ6sjyQ1kidbGtuQL7rs3Ymu4";
    const { content, post_type } = req.body;
    const images = req.files;

    let image_urls = [];

    if (images.length) {
      image_urls = await Promise.all(
        images.map(async (image) => {
          const fileBuffer = fs.readFileSync(image.path);
          const response = await imagekit.upload({
            file: fileBuffer,
            fileName: image.originalname,
            folder: "posts",
          });

          const url = imagekit.url({
            path: response.filePath,
            transformation: [
              { quality: "auto" },
              { format: "webp" },
              { width: "1280" },
            ],
          });
          return url;
        })
      );
    }
    //create post data in db
    await Post.create({
      user: userId,
      content,
      image_urls,
      post_type,
    });
    res.json({ success: true, message: "issue post created successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Get post issue
export const getFeedPosts = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await CitizenFeed.findById(userId);

    //const userId = [userId];
    //get feed , all posts
    // const posts = await Post.find({ user })
    //   .populate("user")
    //   .sort({ createdAt: -1 });

    // res.json({ success: true, posts });
    const posts = await Post.find({ user: userId })
      .populate("user")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//vote posts/issues
export const votePost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { postId } = req.body;

    const post = await Post.findById(postId);

    if (post.votes_count.includes(userId)) {
      post.votes_count = post.votes_count.filter((user) => user !== userId);
      await post.save();
      res.json({ success: true, message: "Issue unVoted" });
    } else {
      post.votes_count.push(userId);
      await post.save();
      res.json({ success: true, message: "Issue upVoted" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
