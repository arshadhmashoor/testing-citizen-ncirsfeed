import CitizenFeed from "../models/CitizenFeed";
//function to get and update user /citizen data

//get user data using userId
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
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
    const { userId } = req.auth();
    const { username, bio, location, full_name } = req.body;

    const tempUser = await CitizenFeed.findById(userId);

    !username && (username = tempUser.username);

    if (tempUser.username !== username) {
      const user = CitizenFeed.findOne({ username });
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

    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
