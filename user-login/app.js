import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 서버 실행 중: http://localhost:${PORT}`));
