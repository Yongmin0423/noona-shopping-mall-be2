import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const ok = await bcrypt.compare(password, user.password);
      if (ok) {
        const token = user.generateToken();
        return res.status(200).json({ status: "success", user, token });
      }
    }
    throw new Error("invalid email or password");
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

export const postLoginWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;
    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const { email, name } = ticket.getPayload();
    console.log("eeee", email, name);
    let user = await User.findOne({ email });
    if (!user) {
      //유저를 새로 생성
      const randomPassword = "" + Math.floor(Math.random() * 1000000000);
      user = await User.create({
        name,
        email,
        password: randomPassword,
      });
    }
    // 토큰발행 리턴
    const sessionToken = await user.generateToken();
    return res
      .status(200)
      .json({ status: "success", user, token: sessionToken });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

//유저 token의 유효성을 검사하는 함수. 이 미들웨어로 req.userId를 추가할 수 있음
export const authenticate = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) {
      throw new Error("Token not found");
    }
    const token = tokenString.replace("Bearer ", ""); //token에서 Bearer 부분 제거
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, payload) => {
      if (error) throw new Error("invalid token");
      //req.userId란 값에 id값을 추가하는 과정.
      req.userId = payload._id;
    });
    next();
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

export const checkAdimPermission = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (user.level !== "admin") throw new Error("no permission");
    next();
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};
