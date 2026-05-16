import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/userRotes.js";
import postRouter from "./routes/postRoutes.js";

// console.log("Mongo URL exists:", !!process.env.MONGODB_URL);

//make express application
const app = express();

await connectDB();

// middle ware
app.use(express.json());
app.use(cors());
//all requests will be pased via this
//  add auth when user is authenticated
app.use(clerkMiddleware());

//create routes
app.get("/", (req, res) => res.send(" Server is running!"));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
