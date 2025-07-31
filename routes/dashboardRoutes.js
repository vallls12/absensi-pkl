const express = require('express');
const router = express.Router();
const db = require('../db');

// Statistik Kehadiran Hari Ini
router.get('/statistik', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const sql = `
    SELECT status, COUNT(*) AS jumlah
    FROM absensi
    WHERE tanggal = ?
    GROUP BY status
  `;

  db.query(sql, [today], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    // Default value semua status
    const data = {
      Hadir: 0,
      Izin: 0,
      Sakit: 0,
      Alpha: 0
    };

    result.forEach(row => {
      data[row.status] = row.jumlah;
    });

    res.json(data);
  });
});

// Rekap Bulanan per Siswa
router.get('/rekap', (req, res) => {
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
    res.json(result);
  });
});

module.exports = router;
