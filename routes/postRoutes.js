import express from "express";

import validateToken from "../middlewares/validateToken.js";
import {
  getPostsHandler,
  getPostHandler,
  createPostHandler,
  deletePostHandler,
  updatePostHandler,
} from "../handlers/index.js";

const postRouter = express.Router();

postRouter.get("/", getPostsHandler);
postRouter.get("/:postId", getPostHandler);

postRouter.use(validateToken);
postRouter.post("/", createPostHandler);
postRouter.delete("/:postId", deletePostHandler);
postRouter.put("/:postId", updatePostHandler);

export default postRouter;
