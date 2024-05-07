// mysql 모듈을 불러옵니다.
const mysql = require('mysql');

// MySQL 서버에 대한 연결 설정입니다. 호스트, 사용자 이름, 비밀번호, 데이터베이스 등을 설정합니다.
const connection = mysql.createConnection({
  host: 'localhost', // MySQL 호스트
  user: 'test', // MySQL 사용자 이름
  password: '1111', // MySQL 비밀번호
  database: 'testdb' // 사용할 데이터베이스 이름
});

// MySQL 서버에 연결합니다.
connection.connect((err) => {
  if (err) {
    console.error('MySQL에 연결할 수 없습니다: ' + err.stack);
    return;
  }

  console.log('MySQL에 연결되었습니다. 연결 ID: ' + connection.threadId);
});

// 예제 쿼리를 실행합니다.
connection.query('SELECT * FROM Products', (err, rows) => {
  if (err) throw err;

  console.log('데이터 가져오기:');
  console.log(rows);
});

// 연결을 종료합니다.
connection.end((err) => {
  if (err) {
    console.error('연결을 종료하는 동안 오류 발생: ' + err.stack);
    return;
  }

  console.log('MySQL 연결이 종료되었습니다.');
});
