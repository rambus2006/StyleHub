const express = require('express');
const bodyParser = require('body-parser');
const multer  = require('multer');
const fs = require('fs');
const mysql = require('mysql');

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

// 파일 업로드를 위한 설정
const upload = multer({ dest: 'uploads/' });

// 상품 추가 라우터
app.post('/addProduct', upload.single('productImage'), (req, res) => {
  const { productName, productDesc, productPrice, productID } = req.body;
  const productImage = req.file.filename; // 업로드된 파일명

  // MySQL에서 상품 정보 추가
  connection.query('INSERT INTO Products (name, description, price, image, product_id) VALUES (?, ?, ?, ?, ?)', [productName, productDesc, productPrice, productImage, productID], (err, result) => {
    if (err) {
      console.error('상품 추가 중 오류 발생: ' + err.stack);
      res.status(500).send('상품 추가 중 오류 발생');
      return;
    }
    res.send('새로운 상품이 성공적으로 추가되었습니다.');
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
