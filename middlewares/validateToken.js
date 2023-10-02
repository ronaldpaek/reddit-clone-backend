import jwt from "jsonwebtoken";

import { prisma } from "../index.js";

const validateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(process.env.NODE_ENV);
    console.log(token);

    if (!token) {
      return res.json({ auth: false, message: "No token provided." });
    }

    // Verify the token
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return next();
    }

    delete user.password;
    req.user = user;
    console.log("User: validateToken", req.user);
    next();
  } catch (err) {
    // Handle token expiration
    if (err.name === "TokenExpiredError") {
      return res.json({ success: false, message: "Token is expired." });
    }
    // Handle other JWT-related errors
    if (err.name === "JsonWebTokenError") {
      return res.json({
        auth: false,
        message: "Failed to authenticate token.",
      });
    }
    // Handle other errors
    next(err);
  }
};

export default validateToken;
