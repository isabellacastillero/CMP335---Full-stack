
const mysql = require('mysql2');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'IsabellaL0603'
});

con.connect(function(err) {
  if (err) {
    console.error('Connection failed:', err.message);
    return;
  }

  console.log('Connected!');
  con.end();
});