// Real-time clock
function updateClock() {
  const now = new Date();
  const jam = now.getHours().toString().padStart(2, '0');
  const menit = now.getMinutes().toString().padStart(2, '0');
  const detik = now.getSeconds().toString().padStart(2, '0');
  const clockEl = document.getElementById("clock");
  if (clockEl) {
    clockEl.textContent = `${jam}:${menit}:${detik}`;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  // Try to parse and format as YYYY-MM-DD
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toISOString().split('T')[0];
}

// Tampilkan data riwayat absensi
function loadRiwayatAbsensi() {
  fetch("http://localhost:3000/api/absensi/list")
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("table tbody");
      if (!tbody) return;
      tbody.innerHTML = "";

      data.forEach((item, index) => {
        const row = `
          <tr>
            <td>${index + 1}</td>
            <td>${item.nama}</td>
            <td>${item.no_induk}</td>
            <td>${item.jurusan}</td>
            <td>${item.status}</td>
            <td>${formatDate(item.tanggal)}</td>
            <td>${item.jam}</td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    })
    .catch(err => {
      console.error("Gagal load data absensi:", err);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  //  Jam
  updateClock();
  setInterval(updateClock, 1000);

  // Tampilkan riwayat absensi
  loadRiwayatAbsensi();

  //  Form sumbit
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const data = {
        nama: document.getElementById("nama").value,
        no_induk: document.getElementById("no_induk").value,
        jurusan: document.getElementById("jurusan").value,
        status: document.querySelector('input[name="status"]:checked')?.value,
      };

      fetch("http://localhost:3000/api/absensi/tambah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then(response => {
          alert(response.message);
          form.reset();
          loadRiwayatAbsensi(); // refresh data setelah submit
        })
        .catch(error => {
          console.error("Gagal input:", error);
          alert("Gagal input data absensi");
        });
    });
  }

  // ☰ Sidebar toggle (jika lo pakai)
  const navToggle = document.getElementById("nav-toggle");
  const nav = document.querySelector("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }
});
