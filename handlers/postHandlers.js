import { prisma } from "../index.js";

const getTotalComments = async (postId) => {
  const directChildren = await prisma.post.findMany({
    where: {
      parentId: postId,
    },
  });

  let totalCount = directChildren.length;
  for (let child of directChildren) {
    totalCount += await getTotalComments(child.id);
  }

  return totalCount;
};

const fetchChildren = async (postId) => {
  const children = await prisma.post.findMany({
    where: {
      parentId: postId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      subreddit: true,
      upVotes: true,
      downVotes: true,
    },
  });

  for (let child of children) {
    child.children = await fetchChildren(child.id);
  }

  return children;
};

export const getPostHandler = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        deleted: false,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        subreddit: true,
        upVotes: true,
        downVotes: true,
      },
    });

    if (!post) {
      return res.json({
        success: false,
        error: "Post not found!",
      });
    }

    post.commentCount = await getTotalComments(post.id);
    post.children = await fetchChildren(post.id);

    res.json({
      success: true,
      post,
    });
  } catch (err) {
    next(err);
  }
};

export const getPostsHandler = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        deleted: false,
        parentId: null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        subreddit: true,
        upVotes: true,
        downVotes: true,
      },
    });

    for (let post of posts) {
      post.children = await fetchChildren(post.id);
    }

    res.json({
      success: true,
      posts,
    });
  } catch (err) {
    next(err);
  }
};

export const createPostHandler = async (req, res, next) => {
  try {
    const { title, text, subredditId, parentId } = req.body;

    if (!req.user) {
      return res.json({
        success: false,
        error: "You must be logged in to create a post!",
      });
    }

    if (!text || !subredditId) {
      return res.json({
        success: false,
        error: "You must provide text and a subredditId when creating a post!",
      });
    }

    const post = await prisma.post.create({
      data: {
        text,
        title,
        userId: req.user.id,
        subredditId,
        parentId,
      },
    });

    res.json({
      success: true,
      post,
    });
  } catch (err) {
    next(err);
  }
};

export const deletePostHandler = async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (!req.user) {
      return res.json({
        success: false,
        error: "You must be logged in to delete a post!",
      });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.json({
        success: false,
        error: "Post not found!",
      });
    }

    if (post.userId !== req.user.id) {
      return res.json({
        success: false,
        error: "You don't have permission to delete this post!",
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { deleted: true },
    });

    res.json({
      success: true,
      message: "Post marked as deleted successfully",
      post: updatedPost,
    });
  } catch (err) {
    next(err);
  }
};

export const updatePostHandler = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { title, text } = req.body;
    console.log({ params: req.params });
    console.log("in the post");

    if (!req.user) {
      return res.json({
        success: false,
        error: "You must be logged in to update a post!",
      });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    console.log({ post });

    if (!post) {
      return res.json({
        success: false,
        error: "Post not found!",
      });
    }

    if (post.userId !== req.user.id) {
      return res.json({
        success: false,
        error: "You don't have permission to update this post!",
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: title || post.title,
        text: text || post.text,
      },
    });

    res.json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (err) {
    next(err);
  }
};
