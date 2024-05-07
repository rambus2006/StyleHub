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
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 파일 저장 경로 지정
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // 업로드된 파일명 사용
  }
});
const upload = multer({ storage: storage });
// 상품 추가 라우터
app.post('/addproduct', upload.single('productImage'), (req, res) => {
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
app.get('/product', (req, res) => {
  connection.query('SELECT * FROM Products', (err, rows) => {
    if (err) {
      console.error('쿼리 실행 중 오류 발생: ' + err.stack);
      return;
    }
    const html = `
      <form id="newProductForm">
      <label for="productName">상품 이름:</label>
      <input type="text" id="productName" name="productName"><br><br>
      <label for="productDesc">상품 설명:</label>
      <input type="text" id="productDesc" name="productDesc"><br><br>
      <label for="productPrice">상품 가격:</label>
      <input type="text" id="productPrice" name="productPrice"><br><br>
      <label for="productImage">상품이미지:</label>
      <input type="file" id="productImage" name="productImage"><br><br>
      <label for="productID">상품ID(카테고리id)</label>
      <input type="number" id="productID" name="productID"><br><br>
      
      <button type="submit">상품 추가</button>
    </form>
    `;
    res.send(html);
  });
});
const port = 3001;
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
