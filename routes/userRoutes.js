import express from "express";

import {
  registerUserHandler,
  loginUserHandler,
  logoutUserHandler,
  retrieveUserTokenHandler,
} from "../handlers/index.js";
import validateToken from "../middlewares/validateToken.js";

const userRouter = express.Router();

userRouter.post("/register", registerUserHandler);
userRouter.post("/login", loginUserHandler);

userRouter.use(validateToken);
userRouter.post("/logout", logoutUserHandler);
userRouter.get("/token", retrieveUserTokenHandler);

export default userRouter;
