import express from "express";
import {
  postJoin,
  getUser,
  getUserDetail,
  updateUser,
} from "../controller/userController.js";
import { authenticate } from "../controller/authController.js";

const userRouter = express.Router();

userRouter.route("/").post(postJoin);
userRouter.get("/me", authenticate, getUser); // 토큰이 valid한 토큰인지 , 이 token을 가지고 유저를 찾아서 리턴
userRouter
  .route("/:id")
  .get(authenticate, getUserDetail)
  .put(authenticate, updateUser);
export default userRouter;
