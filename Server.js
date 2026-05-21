import express from "express";
import aiRoutes from "./routes/ai.js";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()
const port = 3000 
app.use(express.json());
app.use("/ai", aiRoutes);
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {  //이부분 계속 활용해서 페이지마다 html 잘 보내면 됨(css js 안빠지게 조심)
    //메인 홈페이지
    res.sendFile(path.join(__dirname, 'build/index.html'));
})

app.listen(port, () => { //서버 구동시 실행함
    console.log(`Example app listening on port ${port}`)
})