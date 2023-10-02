import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ms from "ms";

import { prisma } from "../index.js";

export const registerUserHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        error: "You must provide a username and password when registering!",
      });
    }

    const checkUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (checkUser) {
      return res.json({
        success: false,
        error: "User already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const isProduction = process.env.NODE_ENV === "production";
    const expiresIn = "24h";
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: expiresIn,
    });

    res.cookie("token", token, {
      maxAge: ms(expiresIn),
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
    });

    res.json({
      success: true,
      message: "Registration successful! Welcome to Reddit.",
    });
  } catch (err) {
    next(err);
  }
};

export const loginUserHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        error: "You must provide a username and password when logging in!",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.json({
        success: false,
        error: "User and/or password is invalid!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({
        success: false,
        error: "User and/or password is invalid!",
      });
    }
    const isProduction = process.env.NODE_ENV === "production";
    const expiresIn = "24h";
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: expiresIn,
    });

    res.cookie("token", token, {
      maxAge: ms(expiresIn),
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
    });

    console.log("User:", req.user);
    res.json({
      success: true,
      message: `Login successful! Welcome back, ${user.username}.`,
    });
  } catch (err) {
    next(err);
  }
};

export const logoutUserHandler = async (req, res, next) => {
  try {
    console.log("Request Headers:", req.headers);
    res.clearCookie("token");
    console.log("User:", req.user);
    res.json({
      success: true,
      message: "You have been logged out successfully.",
    });
  } catch (err) {
    next(err);
  }
};

export const retrieveUserTokenHandler = async (req, res, next) => {
  try {
    console.log("Request Headers:", req.headers);
    console.log("test");
    res.json({
      success: true,
      message: "Token retrieved successfully.",
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};
