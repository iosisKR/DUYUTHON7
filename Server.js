import 'dotenv/config';
import express from "express";
import jwt from "jsonwebtoken";
import http from "http";
import path from "path";
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import cors from "cors";

// 기존 라우터 & 서비스
import aiRoutes from "./routes/ai.js";
import { askGeminiForAlarm } from "./services/gemini.js";

// 추가: 로그인 & 대여 라우터
import authRoutes from "./user-login/routes/authRoutes.js";
import rentalRoutes from "./user-login/routes/rentalRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = new Server(server);

export const rentalHistory = [ //임시 데이터
  {
    date: "2026-05-22",
    time: "09:00",
    location: "신촌역",
    rental: 12,
    return: 104,
  },
  {
    date: "2026-05-22",
    time: "11:00",
    location: "홍대입구",
    rental: 8,
    return: 53,
  },
  {
    date: "2026-05-22",
    time: "13:00",
    location: "강남역",
    rental: 18,
    return: 106,
  },
  {
    date: "2026-05-22",
    time: "15:00",
    location: "판교역",
    rental: 7,
    return: 55,
  },
  {
    date: "2026-05-22",
    time: "17:00",
    location: "건대입구",
    rental: 10,
    return: 58,
  },
];

// ===== 미들웨어 (순서 중요!) =====
app.use(cors({ credentials: true, origin: "https://duyuthon7.onrender.com:3000" }));
app.use(cors({ credentials: true, origin: "https://localhost:5173" }));
app.use(express.json());

// ===== API 라우터 등록 =====
app.use("/ai", aiRoutes);                       // AI 관련 (기존)
app.use("/api/auth", authRoutes);               // 회원가입/로그인
app.use("/api/rental", rentalRoutes);           // 텀블러 대여/반납

// ===== 정적 파일 (프론트) =====
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

// ===== Socket.io 인증 =====
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth.token;

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        socket.user = decoded;
        next();
    } catch (err) {
        next(new Error("인증 실패"));
    }
});

io.on("connection", (socket) => {
    const userId = socket.user.userId;
    socket.join(String(userId));
    console.log(`${userId} joined`);
});

// 다른 파일에서 io 사용 가능하도록 export
export { io };

// ===== 서버 시작 =====
server.listen(port, () => {
    console.log(`🚀 server listening on port ${port}`);
});


async function 재고부족사전경고() {
    try {
        const result = await askGeminiForStock("내용");
        console.log(result);
        return result;
    } catch (error) {
        console.error("Gemini 오류:", error.message);
    }
}

async function 재배치추천() {
    try {
        const result = await askGeminiForMove("내용");
        console.log(result);
        return result;
    } catch (error) {
        console.error("Gemini 오류:", error.message);
    }
}