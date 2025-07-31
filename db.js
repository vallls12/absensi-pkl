const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // username default XAMPP/Laragon
  password: '255256',         // password default biasanya kosong
  database: 'absensi_db'
});

connection.connect((err) => {
  if (err) {
    console.error(' Gagal konek DB:', err.message);
  } else {
    console.log(' Terkoneksi ke MySQL!');
  }
});

module.exports = connection;
