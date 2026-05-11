import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";

// console.log("Mongo URL exists:", !!process.env.MONGODB_URL);

//make express application
const app = express();

await connectDB();

// middle ware
app.use(express.json());
app.use(cors());

//create routes
app.get("/", (req, res) => res.send("Salam! Server is running!"));
app.use("/api/inngest", serve({ client: inngest, functions }));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
