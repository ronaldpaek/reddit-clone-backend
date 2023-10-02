import express from "express";

import {
  getSubredditsHandler,
  createSubredditHandler,
  deleteSubredditHandler,
  getPostsForSubredditHandler,
} from "../handlers/index.js";
import { validateToken } from "../middlewares/index.js";

const subredditRouter = express.Router();

subredditRouter.get("/", getSubredditsHandler);
subredditRouter.get("/:subredditName", getPostsForSubredditHandler);

subredditRouter.use(validateToken);
subredditRouter.post("/", createSubredditHandler);
subredditRouter.delete("/:subredditId", deleteSubredditHandler);

export default subredditRouter;
