import express from "express";
import { authenticate } from "../controller/authController.js";
import { addItemToCart } from "../controller/cartController.js";

const cartRouter = express.Router();

cartRouter.route("/").post(authenticate, addItemToCart);

export default cartRouter;
