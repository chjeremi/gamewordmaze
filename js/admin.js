// js/admin.js
function initAdminPage() {
  const levelForm = document.getElementById('levelForm');

  if (!levelForm) {
    console.error("Elemen form admin tidak ditemukan. Pastikan admin.html sudah dimuat.");
    return;
  }

  levelForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const level = document.getElementById('level').value;
    const gridSize = document.getElementById('gridSize').value;
    const words = document
      .getElementById('words')
      .value.split(',')
      .map((w) => w.trim().toUpperCase())
      .filter((w) => w.length > 0);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Anda harus login sebagai admin untuk menambahkan level.');
        window.location.hash = '#auth';
        return;
      }

      const res = await fetch('https://gamewordmaze.nasiuduklapangantenis.my.id/api/level', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ level: parseInt(level), gridSize: parseInt(gridSize), words })
      });

      if (res.ok) {
        alert('Level berhasil ditambahkan');
        levelForm.reset();
      } else {
        const errorData = await res.json();
        alert(`Gagal menyimpan level: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error('Error saat menambahkan level:', error);
      alert('Terjadi kesalahan saat mencoba menambahkan level. Pastikan server backend berjalan.');
    }
  });
}