const db = require('../db');
const bcrypt = require('bcrypt');
const passwordHash = await bcrypt.hash('255256', );


// Statistik Hari Ini
exports.getStatistikHarian = (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const sql = `
    SELECT 
      status, COUNT(*) AS jumlah
    FROM absensi
    WHERE tanggal = ?
    GROUP BY status
  `;

  db.query(sql, [today], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const data = {
      Hadir: 0,
      Izin: 0,
      Sakit: 0,
      Alpha: 0,
    };

    result.forEach(row => {
      data[row.status] = row.jumlah;
    });

    res.json(data);
  });
};

// Rekap Bulanan per Siswa
exports.getRekapBulanan = (req, res) => {
  const now = new Date();
  const bulan = now.getMonth() + 1;
  const tahun = now.getFullYear();

  const sql = `
    SELECT 
      nama,
      SUM(status = 'Hadir') AS Hadir,
      SUM(status = 'Izin') AS Izin,
      SUM(status = 'Sakit') AS Sakit,
      SUM(status = 'Alpha') AS Alpha
    FROM absensi
    WHERE MONTH(tanggal) = ? AND YEAR(tanggal) = ?
    GROUP BY nama
  `;

  db.query(sql, [bulan, tahun], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    // Format tanggal jadi YYYY-MM-DD sebelum dikirim
const formatted = result.map(item => ({
  ...item,
  tanggal: new Date(item.tanggal).toISOString().split('T')[0]
}));

res.json(formatted);

  });
};

// Daftar Absensi
exports.getListAbsensi = (req, res) => {
  const sql = `SELECT * FROM absensi ORDER BY tanggal DESC, jam DESC`;
  db.query(sql, [], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    // Format tanggal
    const formatted = result.map(item => ({
      ...item,
      tanggal: item.tanggal ? new Date(item.tanggal).toISOString().split('T')[0] : ""
    }));
    res.json(formatted);
  });
};
