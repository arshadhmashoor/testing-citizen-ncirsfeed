import express from "express";
import cors from "cors";
import "dotenv/config";
//temporarity
console.log("Clerk secret exists:", !!process.env.CLERK_SECRET_KEY);
import connectDB from "./configs/db.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/userRotes.js";
import postRouter from "./routes/postRoutes.js";
import storyRouter from "./routes/storyRoutes.js";

// console.log("Mongo URL exists:", !!process.env.MONGODB_URL);

//make express application
const app = express();

await connectDB();

// middle ware
app.use(express.json());
// app.use(cors());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
//all requests will be pased via this
//  add auth when user is authenticated
//app.use(clerkMiddleware());
app.use(
  clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

//create routes
app.get("/", (req, res) => res.send(" Server is running!"));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/user", userRouter);

app.use("/api/post", postRouter);
app.use("/api/story", storyRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
