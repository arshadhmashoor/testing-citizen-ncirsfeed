import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("slm1! Database connected");
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
