import express from "express";
import { authenticate } from "../controller/authController.js";
import {
  createOrder,
  getOrder,
  getOrderList,
  updateOrder,
} from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", authenticate, createOrder);
orderRouter.get("/me", authenticate, getOrder);
orderRouter.get("/", authenticate, getOrderList);
orderRouter.put("/:id", authenticate, updateOrder);

export default orderRouter;
