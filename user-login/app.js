import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import rentalRoutes from './routes/rentalRoutes.js';  // 추가

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rental', rentalRoutes);  // 🆕 추가

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 서버 실행 중: http://localhost:${PORT}`));