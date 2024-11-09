import User from "../models/User.js";
import bcrypt from "bcryptjs";

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

export const getUserDetail = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId).select(
      "-password -__v -createdAt -updatedAt"
    );

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    return res.status(500).json({ status: "fail", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req;
    const { name, currentPassword, newPassword } = req.body;

    // 1. name 필드 검증 (빈칸 또는 공백이 들어오면 오류 반환)
    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ status: "fail", message: "이름을 입력해주세요." });
    }

    // 2. 기존 비밀번호 검증 (빈칸이 아니어야 함)
    if (!currentPassword || currentPassword.trim() === "") {
      return res
        .status(400)
        .json({ status: "fail", message: "기존 비밀번호를 입력해주세요." });
    }

    // 3. 새로운 비밀번호 검증 (빈칸이 아니어야 함)
    if (!newPassword || newPassword.trim() === "") {
      return res
        .status(400)
        .json({ status: "fail", message: "새로운 비밀번호를 입력해주세요." });
    }

    // 4. 기존 비밀번호와 새로운 비밀번호가 동일한지 확인
    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({
          status: "fail",
          message: "기존 비밀번호와 새로운 비밀번호가 동일할 수 없습니다.",
        });
    }

    // 5. 비밀번호 확인 (기존 비밀번호와 비교)
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "유저를 찾을 수 없습니다." });
    }

    // 기존 비밀번호가 맞는지 확인
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ status: "fail", message: "기존 비밀번호가 틀렸습니다." });
    }

    // 6. 업데이트할 데이터 준비
    const updateData = {};
    updateData.name = name; // 이름은 항상 필수

    if (newPassword) {
      // 새로운 비밀번호가 있으면 해싱하여 업데이트
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // 7. 유저 정보 업데이트
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // 업데이트된 사용자 정보 반환
      select: "-password -__v -createdAt -updatedAt", // 비밀번호와 불필요한 필드는 제외
    });

    if (!updatedUser) {
      return res.status(404).json({
        status: "fail",
        message: "유저 정보를 업데이트할 수 없습니다.",
      });
    }

    return res.status(200).json({ status: "success", data: updatedUser });
  } catch (error) {
    return res.status(500).json({ status: "fail", error: error.message });
  }
};
