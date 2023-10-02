import { prisma } from "../index.js";

export const getSubredditsHandler = async (req, res, next) => {
  try {
    console.log("getSubredditsHandler");
    const subreddits = await prisma.subreddit.findMany({});
    res.json({
      success: true,
      subreddits: subreddits.map((subreddit) => ({
        ...subreddit,
        createdAt: subreddit.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
};

export const getPostsForSubredditHandler = async (req, res, next) => {
  try {
    const { subredditName } = req.params;
    console.log("subredditName", subredditName);
    console.log("in getPostsForSubredditHandler");

    // Check if the subreddit exists
    const subreddit = await prisma.subreddit.findUnique({
      where: { name: subredditName },
    });

    if (!subreddit) {
      return res.json({
        success: false,
        error: "Subreddit not found!",
      });
    }
    console.log({ subreddit });
    // Retrieve all posts for the subreddit
    const posts = await prisma.post.findMany({
      where: { subredditId: subreddit.id, deleted: false },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        subreddit: true,
        children: true,
        upVotes: true,
        downVotes: true,
      },
    });

    console.log({ posts });
    res.json({
      success: true,
      posts,
      subredditCreatedAt: subreddit.createdAt,
    });
  } catch (err) {
    next(err);
  }
};

export const createSubredditHandler = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.json({
        success: false,
        error: "Subreddit name is required!",
      });
    }

    const existingSubreddit = await prisma.subreddit.findUnique({
      where: { name },
    });

    if (existingSubreddit) {
      return res.json({
        success: false,
        error: "Subreddit with this name already exists!",
      });
    }

    const subreddit = await prisma.subreddit.create({
      data: {
        name,
        userId: req.user.id,
      },
    });

    console.log({ subreddit });

    res.json({
      success: true,
      ...subreddit,
      createdAt: subreddit.createdAt,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSubredditHandler = async (req, res, next) => {
  try {
    const { subredditId } = req.params;
    console.log("id", subredditId);
    // Check if the subreddit exists
    const existingSubreddit = await prisma.subreddit.findUnique({
      where: { id: subredditId },
    });

    if (!existingSubreddit) {
      return res.status(404).json({
        success: false,
        error: "Subreddit not found!",
      });
    }

    const updatedSubreddit = await prisma.subreddit.update({
      where: { id: subredditId },
      data: { deleted: true },
    });

    res.json({
      success: true,
      subreddit: updatedSubreddit,
    });
  } catch (err) {
    next(err);
  }
};
