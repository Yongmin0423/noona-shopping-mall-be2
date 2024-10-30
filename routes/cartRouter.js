import express from "express";
import { authenticate } from "../controller/authController.js";
import { addItemToCart } from "../controller/cartController.js";
import { getCart } from "../controller/cartController.js";
import { deleteCart } from "../controller/cartController.js";
import { editCart } from "../controller/cartController.js";
import { getCartQty } from "../controller/cartController.js";

const cartRouter = express.Router();

cartRouter
  .route("/")
  .post(authenticate, addItemToCart)
  .get(authenticate, getCart);

cartRouter
  .route("/:id")
  .delete(authenticate, deleteCart)
  .put(authenticate, editCart);

cartRouter.get("/qty", authenticate, getCartQty);
export default cartRouter;
