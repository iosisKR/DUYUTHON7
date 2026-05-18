const express = require('express')
const app = express()
const port = 3000 

app.get('/', (req, res) => {  //이부분 계속 활용해서 페이지마다 html 잘 보내면 됨(css js 안빠지게 조심)
    //메인 홈페이지
    res.send('hello world');
})

app.listen(port, () => { //서버 구동시 실행함
    console.log(`Example app listening on port ${port}`)
})