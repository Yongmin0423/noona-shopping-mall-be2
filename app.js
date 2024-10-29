import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes/apiRouter.js";
import authRouter from "./routes/authRouter.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", apiRouter);
const mongoURI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("mongoose connected");
  } catch (error) {
    console.log("mongoose connection fail", error);
  }
};
connectDB();

app.listen(process.env.PORT || 4400, () => {
  console.log("server on 4400");
});
