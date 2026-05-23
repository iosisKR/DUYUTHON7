import { users } from '../store.js';

// 📍 1. 텀블러 대여
export const rentTumbler = async (req, res) => {
    try {
        const { location } = req.body;
        
        if (!location) {
            return res.status(400).json({ message: '대여 위치를 입력해주세요.' });
        }

        const user = users.find(u => u._id === req.user.userId);
        if (!user) return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });

        // ⛔ 이미 대여 중이면 막기
        if (user.isRenting === true) {
            return res.status(400).json({ 
                message: '이미 대여 중입니다. 먼저 반납해주세요.',
                currentRental: {
                    location: user.currentLocation,
                    time: user.rentTime
                }
            });
        }

        // ✅ 대여 처리
        user.isRenting = true;
        user.totalRentals += 1;
        user.currentLocation = location;     // 🆕 현재 대여 위치 저장
        user.rentTime = new Date();          // 🆕 대여 시각 저장
        
        const record = {
            type: 'rent',
            location: location,
            time: new Date()
        };
        user.history.unshift(record);
        
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

// 📍 2. 텀블러 반납
export const returnTumbler = async (req, res) => {
    try {
        const { location } = req.body;
        
        if (!location) {
            return res.status(400).json({ message: '반납 위치를 입력해주세요.' });
        }

        const user = users.find(u => u._id === req.user.userId);
        if (!user) return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });

        // ⛔ 대여 중이 아니면 막기! (핵심 수정 부분)
        if (user.isRenting !== true) {
            return res.status(400).json({ 
                message: '현재 대여 중인 텀블러가 없습니다. 먼저 대여해주세요.' 
            });
        }

        // ✅ 반납 처리
        user.isRenting = false;
        user.currentLocation = null;         // 🆕 위치 초기화
        user.rentTime = null;                // 🆕 시각 초기화
        
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

// 📍 3. 내 텀블러 상태 조회
export const getMyStatus = async (req, res) => {
    try {
        const user = users.find(u => u._id === req.user.userId);
        if (!user) return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });

        res.json({
            message: '내 텀블러 정보',
            status: {
                isRenting: user.isRenting,
                totalRentals: user.totalRentals,
                currentLocation: user.currentLocation || null,    // 🆕
                rentTime: user.rentTime || null,                  // 🆕
                history: user.history
            }
        });
    } catch (err) {
        res.status(500).json({ message: '서버 에러', error: err.message });
    }
};