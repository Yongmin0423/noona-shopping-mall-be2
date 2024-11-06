import express from "express";
import {
  postLogin,
  postLoginWithGoogle,
} from "../controller/authController.js";

const authRouter = express.Router();

authRouter.post("/login", postLogin);
authRouter.post("/google", postLoginWithGoogle);

export default authRouter;
