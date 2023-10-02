import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";

import {
  userRouter,
  postRouter,
  subredditRouter,
  topicRouter,
  voteRouter,
} from "./routes/index.js";
import {
  togglePremiumHandler,
  toggleOnlineStatusHandler,
} from "./handlers/index.js";
import { validateToken } from "./middlewares/index.js";

dotenv.config();

export const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/subreddits", subredditRouter);
app.use("/topics", topicRouter);
app.use("/votes", voteRouter);

app.post("/toggle-premium", validateToken, togglePremiumHandler);
app.post("/toggle-online-status", validateToken, toggleOnlineStatusHandler);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Reddit server!",
  });
});

app.use((err, req, res, next) => {
  res.json({
    success: false,
    message: err.message,
  });
});

app.use((req, res) => {
  res.json({
    success: false,
    message: "404 Not Found",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
