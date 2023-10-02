import express from "express";

import { prisma } from "../index.js";

const topicRouter = express.Router();


topicRouter.get("/", async (req, res, next) => {
  try {
    const topics = await prisma.topic.findMany({});
    console.log(topics);
    res.json({
      success: true,
      topics,
    });
  } catch (err) {
    next(err);
  }
});

export default topicRouter;
