const express = require('express');
const router = express.Router();
const db = require('../db');

// Route GET /api/absensi/list
router.get('/list', (req, res) => {
  db.query("SELECT * FROM absensi ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Rekap Bulanan (group by nama dan status)
router.get('/bulanan', (req, res) => {
  const sql = `
    SELECT nama,
      SUM(status = 'Hadir') AS hadir,
      SUM(status = 'Izin') AS izin,
      SUM(status = 'Sakit') AS sakit,
      SUM(status = 'Alpha') AS alpha,
      MAX(tanggal) AS tanggal,
      MAX(jam) AS waktu,
      MAX(id) AS id
    FROM absensi
    GROUP BY nama
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get('/statistik-hari-ini', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const sql = `
    SELECT
      SUM(status = 'Hadir') AS hadir,
      SUM(status = 'Izin') AS izin,
      SUM(status = 'Sakit') AS sakit,
      SUM(status = 'Alpha') AS alpha
    FROM absensi
    WHERE tanggal = ?
  `;
  db.query(sql, [today], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
});

// Route POST /api/absensi/tambah
router.post('/tambah', (req, res) => {
  const { nama, no_induk, jurusan, status } = req.body;
  const tanggal = new Date().toISOString().split('T')[0];
  const jam = new Date().toTimeString().split(' ')[0];
  const sql = `
    INSERT INTO absensi (nama, no_induk, jurusan, status, tanggal, jam)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [nama, no_induk, jurusan, status, tanggal, jam], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Berhasil input absensi" });
  });
});

// Hapus data absensi berdasarkan ID
router.delete('/hapus/:id', (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM absensi WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Data berhasil dihapus" });
  });
});

module.exports = router;