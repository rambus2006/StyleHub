// 필요한 모듈 로드
const express = require('express');
const mysql = require('mysql');

// Express 애플리케이션 생성
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'test',
    password: '1111',
    database: 'testdb'
  });


// MySQL 연결
connection.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류: ', err);
    throw err;
  }
  console.log('MySQL에 연결되었습니다.');
});

// 사용자의 이메일과 비밀번호로 로그인 확인
function login(email, password, callback) {
  const query = `SELECT * FROM user WHERE email = '${email}' AND pw = '${password}'`;
  connection.query(query, (err, results) => {
    if (err) throw err;
    callback(results.length > 0);
  });
}

// Express 미들웨어 설정
app.use(express.urlencoded({ extended: true }));

// HTML 템플릿
const loginForm = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
</head>
<body>
  <h1>Login</h1>
  <form action="/login" method="POST">
    <label for="email">Email:</label><br>
    <input type="email" id="email" name="email" required><br>
    <label for="password">Password:</label><br>
    <input type="password" id="password" name="password" required><br><br>
    <button type="submit">Login</button>
  </form>
</body>
</html>
`;

// HTML 파일 제공
app.get('/', (req, res) => {
  res.send(loginForm);
});

// POST 요청 처리
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  login(email, password, (loggedIn) => {
    if (loggedIn) {
      res.send('로그인 성공!');
    } else {
      res.send('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
  });
});

// 서버 시작
const port = 3000;
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
