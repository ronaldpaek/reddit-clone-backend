import { prisma } from "../index.js";

export const upvotePostHandler = async (req, res) => {
  const userId = req.user.id; // Assuming you send userId in the request body
  const { postId } = req.params;
  console.log({ userId, postId });

  try {
    const upvote = await prisma.upvote.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });
    res.json({ success: true, upvote });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const upvoteDeleteHandler = async (req, res) => {
  const userId = req.user.id; // Assuming you send userId in the request body
  const { postId } = req.params;

  try {
    const upvote = await prisma.upvote.delete({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });
    res.json({ success: true, upvote });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const downvotePostHandler = async (req, res) => {
  const userId = req.user.id; // Assuming you send userId in the request body
  const { postId } = req.params;

  try {
    const downvote = await prisma.downvote.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });
    res.json({ success: true, downvote });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const downvoteDeleteHandler = async (req, res) => {
  const userId = req.user.id; // Assuming you send userId in the request body
  const { postId } = req.params;

  try {
    const downvote = await prisma.downvote.delete({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });
    res.json({ success: true, downvote });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
