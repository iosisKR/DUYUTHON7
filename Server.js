import express from "express";
import aiRoutes from "./routes/ai.js";
import jwt from "jsonwebtoken";
import http from "http";
import path from "path";
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import { askGeminiForAlarm } from "./services/gemini.js";
import cors from "cors"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use("/ai", aiRoutes);

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});


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

server.listen(port, () => {
    console.log(`server listening on port ${port}`);
    재고부족사전경고()
});



async function 재고부족사전경고(){
    try {
  const result = await askGeminiForAlarm("길거리쓰레기!AND!텀블러 15회 사용");

  console.log(result);
} catch (error) {
  console.error("Gemini 오류:", error.message);
}
}