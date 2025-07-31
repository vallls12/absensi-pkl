const express = require('express');
const router = express.Router();
const db = require('../db');

// Login admin
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM admin WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      res.json({ message: 'Login sukses' });
    } else {
      res.status(401).json({ message: 'Username atau password salah' });
    }
  });
});

module.exports = router;