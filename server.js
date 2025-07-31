const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve file HTML statis
app.use(express.static(path.join(__dirname, '../frontend')));

// Routing default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../absensi-siswa/frontend/index.html'));
});

// Routing API
const absensiRoutes = require('./routes/absensiRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/absensi', absensiRoutes);
app.use('/api/admin', adminRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server jalan di http://localhost:${PORT}`);
});
