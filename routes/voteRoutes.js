import express from "express";

import {
  upvotePostHandler,
  upvoteDeleteHandler,
  downvotePostHandler,
  downvoteDeleteHandler,
} from "../handlers/index.js";
import validateToken from "../middlewares/validateToken.js";

const voteRouter = express.Router();
voteRouter.use(validateToken);

// POST /votes/upvotes/:postId
voteRouter.post("/upvotes/:postId", upvotePostHandler);

// DELETE /votes/upvotes/:postId
voteRouter.delete("/upvotes/:postId", upvoteDeleteHandler);

// POST /votes/downvotes/:postId
voteRouter.post("/downvotes/:postId", downvotePostHandler);

// DELETE /votes/downvotes/:postId
voteRouter.delete("/downvotes/:postId", downvoteDeleteHandler);

export default voteRouter;
