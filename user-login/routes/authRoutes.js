const express = require('express');
const router = express.Router();
const { signup, login, me } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
// 로그인한 사람만 접근 가능한 API
router.get('/me', authMiddleware,me);

module.exports = router;