// js/level-select.js
function initLevelSelectPage() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  let lastLevel = parseInt(localStorage.getItem('last_level')) || 1;
  const completed = JSON.parse(localStorage.getItem('completed_levels') || '[]');

  if (!token || !userId) {
    alert('Kamu belum login!');
    window.location.hash = '#auth';
    return;
  }

  const maxLevel = lastLevel + 2;

  const levelGrid = document.getElementById('levelGrid');
  if (!levelGrid) {
    console.error("Elemen #levelGrid tidak ditemukan.");
    return;
  }
  levelGrid.innerHTML = ''; // Pastikan grid bersih sebelum menambahkan tombol

  for (let i = 1; i <= maxLevel; i++) {
    const btn = document.createElement('button');
    btn.innerText = `Level ${i}`;
    btn.className = 'level-btn';

    if (completed.includes(i)) {
      btn.classList.add('completed');
      btn.disabled = true;
    }

    btn.onclick = () => {
      localStorage.setItem('last_level', i);
      window.location.hash = '#game';
    };

    levelGrid.appendChild(btn);
  }

  const logoutButton = document.getElementById('logout');
  if (logoutButton) {
    logoutButton.onclick = () => {
      localStorage.clear();
      window.location.hash = '#auth';
    };
  }
}