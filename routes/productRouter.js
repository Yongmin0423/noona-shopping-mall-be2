import express from "express";
import {
  authenticate,
  checkAdimPermission,
} from "../controller/authController.js";

import {
  deleteProduct,
  getProduct,
  getProductDetail,
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
  .get(getProductDetail)
  .put(authenticate, checkAdimPermission, updateProduct)
  .delete(authenticate, checkAdimPermission, deleteProduct);
export default productRouter;
