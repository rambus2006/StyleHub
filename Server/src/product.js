//현재 상품을 모두 보여주는 코드
const express = require('express');
const mysql = require('mysql');
const loginUser = require('./db_conn.js'); // loginUser 모듈을 불러옵니다.

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'test',
  password: '1111',
  database: 'testdb'
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL에 연결할 수 없습니다: ' + err.stack);
    return;
  }
  console.log('MySQL에 연결되었습니다. 연결 ID: ' + connection.threadId);
});

// 로그인 기능을 추가합니다.
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  loginUser(username, password, (err, success) => {
    if (err) {
      console.error('로그인 중 오류 발생: ' + err);
      return;
    }

    if (success) {
      res.send('로그인 성공!');
    } else {
      res.status(401).send('로그인 실패');
    }
  });
});

app.get('/product', (req, res) => {
  connection.query('SELECT * FROM Products', (err, rows) => {
    if (err) {
      console.error('쿼리 실행 중 오류 발생: ' + err.stack);
      return;
    }
    const html = `
      <h1>상품 목록</h1>
      <ul>
        ${rows.map(row => `<li> ${row.name}: $${row.price} <img src="${row.image_url}"></li>`).join('')}
      </ul>
    `;
    res.send(html);
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
