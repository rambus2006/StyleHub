const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'test',
    password: '1111',
    database: 'testdb'
  });

connection.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류: ', err);
    throw err;
  }
  console.log('MySQL에 연결되었습니다.');
});

function login(email, password, callback) {
  const query = `SELECT * FROM user WHERE email = '${email}' AND pw = '${password}'`;
  connection.query(query, (err, results) => {
    if (err) throw err;
    callback(results.length > 0);
  });
}

// 정적 파일 미들웨어 설정
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  res.sendFile(indexPath);
});
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
app.get('/login', (req, res) => {
  res.send(loginForm);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  login(email, password, (loggedIn) => {
    if (loggedIn) {
      res.json({ redirect: '/' }); // 클라이언트에게 리디렉션할 경로를 응답으로 보냄
    } else {
      res.send('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
