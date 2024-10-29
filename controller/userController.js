import User from "../models/User.js";

export const postJoin = async (req, res) => {
  try {
    const { email, password, name, level } = req.body;
    const exist = await User.exists({ email });
    if (exist) {
      throw new Error("This user already exist");
    }
    const newUser = await User.create({
      email,
      password,
      name,
      level: level ? level : "customer",
    });
    return res.status(200).json({ status: "success", data: newUser });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (user) {
      return res.status(200).json({ status: "success", user });
    }
    throw new Error("Invalid token");
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};
