//상품 수정하기 
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const loginUser = require('./db_conn.js');

const app = express();

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'test',
  password: '1111',
  database: 'testdb'
});

// MySQL 연결
connection.connect((err) => {
  if (err) {
    console.error('MySQL에 연결할 수 없습니다: ' + err.stack);
    return;
  }
  console.log('MySQL에 연결되었습니다. 연결 ID: ' + connection.threadId);
});

// Body parser 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 상품 수정 라우터
app.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const { name, price } = req.body;

  // MySQL에서 해당 상품 정보 업데이트
  connection.query('UPDATE Products SET name = ?, price = ? WHERE product_id = ?', [name, price, productId], (err, result) => {
    if (err) {
      console.error('상품 정보 업데이트 중 오류 발생: ' + err.stack);
      res.status(500).send('상품 정보 업데이트 중 오류 발생');
      return;
    }
    res.send('상품 정보가 성공적으로 업데이트되었습니다.');
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
