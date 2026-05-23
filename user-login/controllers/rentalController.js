import { users } from '../store.js';

// 📍 1. 텀블러 대여하기
export const rentTumbler = async (req, res) => {
  try {
    const { location } = req.body;
    
    if (!location) {
      return res.status(400).json({ message: '대여 위치를 입력해주세요.' });
    }

    const user = users.find(u => u._id === req.user.userId);
    if (!user) return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });

    // 이미 대여 중이면 거부
    if (user.isRenting) {
      return res.status(400).json({ 
        message: '이미 대여 중입니다. 먼저 반납해주세요.' 
      });
    }

    // 대여 처리
    user.isRenting = true;
    user.totalRentals += 1;
    
    // 이용 내역 추가
    const record = {
      type: 'rent',
      location: location,
      time: new Date()
    };
    user.history.unshift(record);  // 맨 앞에 추가 (최신순)
    
    // 최대 10개만 유지
    if (user.history.length > 10) {
      user.history = user.history.slice(0, 10);
    }

    res.json({
      message: '대여 성공!',
      rental: record,
      totalRentals: user.totalRentals
    });
  } catch (err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};

// 📍 2. 텀블러 반납하기
export const returnTumbler = async (req, res) => {
  try {
    const { location } = req.body;
    
    if (!location) {
      return res.status(400).json({ message: '반납 위치를 입력해주세요.' });
    }

    const user = users.find(u => u._id === req.user.userId);
    if (!user) return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });

    // 대여 중이 아니면 거부
    if (!user.isRenting) {
      return res.status(400).json({ 
        message: '대여 중인 텀블러가 없습니다.' 
      });
    }

    // 반납 처리
    user.isRenting = false;
    
    // 이용 내역 추가
    const record = {
      type: 'return',
      location: location,
      time: new Date()
    };
    user.history.unshift(record);
    
    if (user.history.length > 10) {
      user.history = user.history.slice(0, 10);
    }

    res.json({
      message: '반납 성공!',
      return: record
    });
  } catch (err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};

// 📍 3. 내 텀블러 상태 조회 (대여 여부 + 횟수 + 이용내역)
export const getMyStatus = async (req, res) => {
  try {
    const user = users.find(u => u._id === req.user.userId);
    if (!user) return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });

    res.json({
      message: '내 텀블러 정보',
      status: {
        isRenting: user.isRenting,         // 1. 현재 대여 여부
        totalRentals: user.totalRentals,   // 2. 총 대여 횟수
        history: user.history              // 3. 최근 이용 내역
      }
    });
  } catch (err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};