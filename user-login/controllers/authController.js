// user-login/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { users } from "../store.js";

const JWT_SECRET = process.env.JWT_SECRET || "duyuthon7_secret_key";

// ✅ 회원가입
export const signup = async (req, res) => {
  try {
    const { email, password, name, interest } = req.body;  // 🆕 interest 추가

    // 필수 항목 체크
    if (!email || !password) {
      return res.status(400).json({ 
        message: "이메일과 비밀번호를 입력해주세요." 
      });
    }

    // 이메일 중복 체크
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        message: "이미 가입된 이메일입니다." 
      });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = {
      _id: Date.now().toString(),
      email,
      password: hashedPassword,
      name: name || email,
      interest: interest || "",  // 🆕 환경 관심사 추가
      createdAt: new Date(),
      isRenting: false,
      totalRentals: 0,
      currentLocation: null,
      rentTime: null,
      history: []
    };

    users.push(user);

    console.log(`✅ 회원가입 완료: ${email} (관심사: ${interest})`);

    res.status(201).json({
      message: "회원가입 성공!",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        interest: user.interest
      }
    });
  } catch (err) {
    console.error("❌ 회원가입 에러:", err);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};

// ✅ 로그인
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: "이메일과 비밀번호를 입력해주세요." 
      });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ 
        message: "존재하지 않는 이메일입니다." 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: "비밀번호가 일치하지 않습니다." 
      });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`✅ 로그인 성공: ${email}`);

    res.json({
      message: "로그인 성공!",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        interest: user.interest
      }
    });
  } catch (err) {
    console.error("❌ 로그인 에러:", err);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};

// ✅ 내 정보 조회
export const me = async (req, res) => {
  try {
    const user = users.find(u => u._id === req.user._id);
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      interest: user.interest,
      isRenting: user.isRenting,
      totalRentals: user.totalRentals,
      currentLocation: user.currentLocation,
      rentTime: user.rentTime,
      history: user.history
    });
  } catch (err) {
    console.error("❌ 내 정보 조회 에러:", err);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};