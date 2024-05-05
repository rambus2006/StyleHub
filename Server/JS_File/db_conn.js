// login.js

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'test',
  password: '1111',
  database: 'testdb'
});

function loginUser(username, password, callback) {
  connection.query('SELECT * FROM Users WHERE username = ? AND password = ?', [username, password], (err, rows) => {
    if (err) {
      console.error('쿼리 실행 중 오류 발생: ' + err.stack);
      callback(err, null);
      return;
    }

    if (rows.length > 0) {
      // 로그인 성공
      callback(null, true);
    } else {
      // 로그인 실패
      callback(null, false);
    }
  });
}

module.exports = loginUser;
