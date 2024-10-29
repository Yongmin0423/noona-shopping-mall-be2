import express from "express";
import {
  authenticate,
  checkAdimPermission,
} from "../controller/authController.js";

import {
  getProduct,
  postProduct,
  updateProduct,
} from "../controller/productController.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .post(authenticate, checkAdimPermission, postProduct)
  .get(getProduct);

productRouter
  .route("/:id")
  .put(authenticate, checkAdimPermission, updateProduct);

export default productRouter;
