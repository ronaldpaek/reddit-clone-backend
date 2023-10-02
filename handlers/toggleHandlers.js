import { prisma } from "../index.js";

export const togglePremiumHandler = async (req, res, next) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.json({
        success: false,
        error: "User is not authenticated!",
      });
    }

    // Fetch the current user's premium status
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    // Toggle the premium status
    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        isPremium: !user.isPremium,
      },
    });

    // Determine the message based on the updated premium status
    const message = updatedUser.isPremium
      ? "Successfully upgraded to Premium!"
      : "Successfully downgraded from Premium.";

    res.json({
      success: true,
      message: message,
      isPremium: updatedUser.isPremium,
    });
  } catch (err) {
    next(err);
  }
};

export const toggleOnlineStatusHandler = async (req, res, next) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.json({
        success: false,
        error: "User is not authenticated!",
      });
    }

    // Fetch the current user's online status
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    // Toggle the online status
    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        isOnline: !user.isOnline,
      },
    });

    const message = updatedUser.isOnline
      ? "You are now online!"
      : "You are now offline.";

    res.json({
      success: true,
      message: message,
      isOnline: updatedUser.isOnline,
    });
  } catch (err) {
    next(err);
  }
};
