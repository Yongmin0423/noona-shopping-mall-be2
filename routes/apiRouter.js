import express from "express";
import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";
import productRouter from "./productRouter.js";
import cartRouter from "./cartRouter.js";
import orderRouter from "./orderRouter.js";

const apiRouter = express.Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/product", productRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/order", orderRouter);

export default apiRouter;
