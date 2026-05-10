import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("slm! Database connected");
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
