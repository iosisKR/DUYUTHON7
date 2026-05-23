require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB 연결 부분 주석 처리
// mongoose.connect(...)

app.use('/api/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 서버 실행 중: http://localhost:${PORT}`));