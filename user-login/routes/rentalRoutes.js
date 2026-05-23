import express from 'express';
import { rentTumbler, returnTumbler, getMyStatus } from '../controllers/rentalController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// 모든 라우트는 로그인 필요!
router.post('/rent', authMiddleware, rentTumbler);        // 대여
router.post('/return', authMiddleware, returnTumbler);    // 반납
router.get('/status', authMiddleware, getMyStatus);       // 내 상태 조회

export default router;