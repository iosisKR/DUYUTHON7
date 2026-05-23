import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { users } from '../store.js';

// 회원가입
export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const exists = users.find(u => u.email === email);
    if (exists) return res.status(400).json({ message: '이미 가입된 이메일입니다.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      _id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
      
      // 🆕 텀블러 관련 필드
      isRenting: false,      // 대여 중 여부
      totalRentals: 0,       // 총 대여 횟수
      history: []            // 이용 내역 (최대 10개 유지)
    };
    users.push(user);

    res.status(201).json({ message: '회원가입 성공', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};

// 로그인
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: '존재하지 않는 계정입니다.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: '로그인 성공', token });
  } catch (err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};

// 내 정보 조회 (텀블러 정보 포함!)
export const me = async (req, res) => {
  try {
    const user = users.find(u => u._id === req.user.userId);
    if (!user) return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });

    const { password, ...userInfo } = user;
    
    res.json({
      message: '인증 성공',
      user: userInfo  // 🆕 isRenting, totalRentals, history 모두 포함됨!
    });
  } catch (err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};