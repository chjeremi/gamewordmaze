// // js/game.js
// function initGamePage() {
//   const token = localStorage.getItem('token');
//   const userId = localStorage.getItem('userId');
//   let level = parseInt(localStorage.getItem('last_level')) || 1;
//   let score = parseInt(localStorage.getItem('score')) || 0;
//   const completed = new Set(JSON.parse(localStorage.getItem('completed_levels') || '[]'));

//   if (!token || !userId) {
//     alert('Kamu belum login!');
//     window.location.hash = '#auth';
//     return;
//   }

//   if (completed.has(level)) {
//     alert(`Level ${level} sudah selesai. Pilih level lain.`);
//     window.location.hash = '#level-select';
//     return;
//   }

//   const scoreElement = document.getElementById('score');
//   const levelDisplayElement = document.getElementById('levelDisplay');
//   const nextLevelBtn = document.getElementById('nextLevelBtn');

//   if (scoreElement) scoreElement.innerText = `Skor: ${score}`;
//   if (levelDisplayElement) levelDisplayElement.innerText = `Level ${level}`;
//   if (nextLevelBtn) nextLevelBtn.style.display = 'none';

//   async function loadLevel(currentLevel) {
//     const res = await fetch(`http://localhost:3000/api/level/${currentLevel}`);
//     if (!res.ok) return alert('Level tidak tersedia!');
//     const data = await res.json();

//     const { gridSize, words } = data;
//     const grid = document.getElementById('grid');
//     if (!grid) {
//         console.error("Elemen #grid tidak ditemukan.");
//         return;
//     }
//     grid.innerHTML = '';
//     grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

//     const wordsListElement = document.getElementById('words');
//     if (!wordsListElement) {
//         console.error("Elemen #words tidak ditemukan.");
//         return;
//     }
//     wordsListElement.innerHTML = '';
//     words.forEach(word => {
//       const li = document.createElement('li');
//       li.innerText = word;
//       li.id = 'word-' + word;
//       wordsListElement.appendChild(li);
//     });

//     const directions = [
//       [0, 1], [0, -1], [1, 0], [-1, 0],
//       [1, 1], [-1, -1], [1, -1], [-1, 1]
//     ];

//     const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//     const matrix = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
//     const positions = {};

//     for (let word of words) {
//       let placed = false;
//       const shuffledDirs = directions.sort(() => Math.random() - 0.5);
//       for (const [dx, dy] of shuffledDirs) {
//         for (let attempt = 0; attempt < 100 && !placed; attempt++) {
//           const startRow = Math.floor(Math.random() * gridSize);
//           const startCol = Math.floor(Math.random() * gridSize);

//           const endRow = startRow + dx * (word.length - 1);
//           const endCol = startCol + dy * (word.length - 1);

//           if (endRow < 0 || endRow >= gridSize || endCol < 0 || endCol >= gridSize) continue;

//           let canPlace = true;
//           for (let i = 0; i < word.length; i++) {
//             const r = startRow + dx * i;
//             const c = startCol + dy * i;
//             if (matrix[r][c] && matrix[r][c] !== word[i]) {
//               canPlace = false;
//               break;
//             }
//           }

//           if (canPlace) {
//             positions[word] = [];
//             for (let i = 0; i < word.length; i++) {
//               const r = startRow + dx * i;
//               const c = startCol + dy * i;
//               matrix[r][c] = word[i];
//               positions[word].push([r, c]);
//             }
//             placed = true;
//           }
//         }
//         if (placed) break;
//       }
//     }

//     for (let i = 0; i < gridSize; i++) {
//       for (let j = 0; j < gridSize; j++) {
//         if (!matrix[i][j]) matrix[i][j] = letters[Math.floor(Math.random() * letters.length)];
//       }
//     }

//     for (let i = 0; i < gridSize; i++) {
//       for (let j = 0; j < gridSize; j++) {
//         const cell = document.createElement('div');
//         cell.className = 'cell';
//         cell.innerText = matrix[i][j];
//         cell.dataset.row = i;
//         cell.dataset.col = j;
//         grid.appendChild(cell);
//       }
//     }

//     let isDragging = false;
//     let dragPath = [];
//     let lastRow = null, lastCol = null;

//     function getCell(row, col) {
//       return document.querySelector(`[data-row='${row}'][data-col='${col}']`);
//     }

//     function arraysEqual(a, b) {
//       if (a.length !== b.length) return false;
//       for (let i = 0; i < a.length; i++) {
//         if (a[i][0] !== b[i][0] || a[i][1] !== b[i][1]) return false;
//       }
//       return true;
//     }

//     function checkLevelCompletion() {
//       const allFound = words.every(w => document.getElementById('word-' + w).classList.contains('found'));
//       if (allFound) {
//         if (nextLevelBtn) nextLevelBtn.style.display = 'inline-block';
//       }
//     }

//     function checkWordDrag() {
//       for (const [word, coords] of Object.entries(positions)) {
//         if (arraysEqual(coords, dragPath)) {
//           coords.forEach(pos => {
//             const cell = getCell(pos[0], pos[1]);
//             if (cell) {
//                 cell.classList.remove('selected');
//                 cell.classList.add('found');
//             }
//           });
//           const wordElement = document.getElementById('word-' + word);
//           if (wordElement && !wordElement.classList.contains('found')) {
//             score += 10;
//             localStorage.setItem('score', score);
//             if (scoreElement) scoreElement.innerText = `Skor: ${score}`;
//           }
//           if (wordElement) wordElement.classList.add('found');
//         }
//       }
//       document.querySelectorAll('.selected').forEach(c => c.classList.remove('selected'));
//       checkLevelCompletion();
//     }

//     const gridEl = document.getElementById('grid');
//     if (gridEl) {
//       gridEl.addEventListener('mousedown', handleStart);
//       gridEl.addEventListener('mousemove', handleMove);
//       document.addEventListener('mouseup', handleEnd);

//       gridEl.addEventListener('touchstart', (e) => {
//         e.preventDefault();
//         handleStart(e.touches[0]);
//       }, { passive: false });

//       gridEl.addEventListener('touchmove', (e) => {
//         e.preventDefault();
//         const touch = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
//         handleMove({ target: touch });
//       }, { passive: false });

//       document.addEventListener('touchend', handleEnd);
//     }

//     function handleStart(e) {
//       const cell = e.target;
//       if (!cell || !cell.classList.contains('cell')) return;
//       isDragging = true;
//       dragPath = [];
//       lastRow = parseInt(cell.dataset.row);
//       lastCol = parseInt(cell.dataset.col);
//       cell.classList.add('selected');
//       dragPath.push([lastRow, lastCol]);
//     }

//     function handleMove(e) {
//       if (!isDragging) return;
//       const cell = e.target;
//       if (!cell || !cell.classList.contains('cell')) return;
//       const row = parseInt(cell.dataset.row);
//       const col = parseInt(cell.dataset.col);
//       if (row === lastRow && col === lastCol) return;

//       const dr = Math.abs(row - lastRow);
//       const dc = Math.abs(col - lastCol);
//       if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1) || (dr === 1 && dc === 1)) {
//         cell.classList.add('selected');
//         dragPath.push([row, col]);
//         lastRow = row;
//         lastCol = col;
//       }
//     }

//     function handleEnd() {
//       isDragging = false;
//       checkWordDrag();
//       dragPath = [];
//       lastRow = null;
//       lastCol = null;
//     }
//   }

//   loadLevel(level);

//   if (nextLevelBtn) {
//     nextLevelBtn.onclick = async () => {
//       const completedLevels = new Set(JSON.parse(localStorage.getItem('completed_levels')) || []);
//       completedLevels.add(level);
//       localStorage.setItem('completed_levels', JSON.stringify(Array.from(completedLevels)));

//       level++;
//       localStorage.setItem('last_level', level);
//       if (levelDisplayElement) levelDisplayElement.innerText = `Level ${level}`;
//       if (nextLevelBtn) nextLevelBtn.style.display = 'none';

//       await fetch('http://localhost:3000/api/user/last-level', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ userId, level })
//       });

//       window.location.hash = '#level-select';
//     };
//   }

//   const logoutButton = document.getElementById('logout');
//   if (logoutButton) {
//     logoutButton.onclick = () => {
//       localStorage.clear();
//       window.location.hash = '#auth';
//     };
//   }
// }

// js/game.js
function initGamePage() {
  // Panggil fungsi inisialisasi floating letters dari index.js
  // Ini akan menambahkan kembali huruf-huruf mengambang seperti di halaman index.
  if (typeof initIndexPage === 'function') {
    initIndexPage();
  }

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  let level = parseInt(localStorage.getItem('last_level')) || 1;
  let score = parseInt(localStorage.getItem('score')) || 0;
  const completed = new Set(JSON.parse(localStorage.getItem('completed_levels') || '[]'));

  if (!token || !userId) {
    alert('Kamu belum login!');
    window.location.hash = '#auth';
    return;
  }

  if (completed.has(level)) {
    alert(`Level ${level} sudah selesai. Pilih level lain.`);
    window.location.hash = '#level-select';
    return;
  }

  const scoreElement = document.getElementById('score');
  const levelDisplayElement = document.getElementById('levelDisplay');
  const nextLevelBtn = document.getElementById('nextLevelBtn');

  if (scoreElement) scoreElement.innerText = `Skor: ${score}`;
  if (levelDisplayElement) levelDisplayElement.innerText = `Level ${level}`;
  if (nextLevelBtn) nextLevelBtn.style.display = 'none';

  async function loadLevel(currentLevel) {
    const res = await fetch(`https://gamewordmaze.nasiuduklapangantenis.my.id/api/level/${currentLevel}`);
    if (!res.ok) return alert('Level tidak tersedia!');
    const data = await res.json();

    const { gridSize, words } = data;
    const grid = document.getElementById('grid');
    if (!grid) {
        console.error("Elemen #grid tidak ditemukan.");
        return;
    }
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    const wordsListElement = document.getElementById('words');
    if (!wordsListElement) {
        console.error("Elemen #words tidak ditemukan.");
        return;
    }
    wordsListElement.innerHTML = '';
    words.forEach(word => {
      const li = document.createElement('li');
      li.innerText = word;
      li.id = 'word-' + word;
      wordsListElement.appendChild(li);
    });

    const directions = [
      [0, 1], [0, -1], [1, 0], [-1, 0],
      [1, 1], [-1, -1], [1, -1], [-1, 1]
    ];

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const matrix = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
    const positions = {};

    for (let word of words) {
      let placed = false;
      const shuffledDirs = directions.sort(() => Math.random() - 0.5);
      for (const [dx, dy] of shuffledDirs) {
        for (let attempt = 0; attempt < 100 && !placed; attempt++) {
          const startRow = Math.floor(Math.random() * gridSize);
          const startCol = Math.floor(Math.random() * gridSize);

          const endRow = startRow + dx * (word.length - 1);
          const endCol = startCol + dy * (word.length - 1);

          if (endRow < 0 || endRow >= gridSize || endCol < 0 || endCol >= gridSize) continue;

          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            const r = startRow + dx * i;
            const c = startCol + dy * i;
            if (matrix[r][c] && matrix[r][c] !== word[i]) {
              canPlace = false;
              break;
            }
          }

          if (canPlace) {
            positions[word] = [];
            for (let i = 0; i < word.length; i++) {
              const r = startRow + dx * i;
              const c = startCol + dy * i;
              matrix[r][c] = word[i];
              positions[word].push([r, c]);
            }
            placed = true;
          }
        }
        if (placed) break;
      }
    }

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (!matrix[i][j]) matrix[i][j] = letters[Math.floor(Math.random() * letters.length)];
      }
    }

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.innerText = matrix[i][j];
        cell.dataset.row = i;
        cell.dataset.col = j;
        grid.appendChild(cell);
      }
    }

    let isDragging = false;
    let dragPath = [];
    let lastRow = null, lastCol = null;

    function getCell(row, col) {
      return document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    }

    function arraysEqual(a, b) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (a[i][0] !== b[i][0] || a[i][1] !== b[i][1]) return false;
      }
      return true;
    }

    function checkLevelCompletion() {
      const allFound = words.every(w => document.getElementById('word-' + w).classList.contains('found'));
      if (allFound) {
        if (nextLevelBtn) nextLevelBtn.style.display = 'inline-block';
      }
    }

    function checkWordDrag() {
      for (const [word, coords] of Object.entries(positions)) {
        if (arraysEqual(coords, dragPath)) {
          coords.forEach(pos => {
            const cell = getCell(pos[0], pos[1]);
            if (cell) {
                cell.classList.remove('selected');
                cell.classList.add('found');
            }
          });
          const wordElement = document.getElementById('word-' + word);
          if (wordElement && !wordElement.classList.contains('found')) {
            score += 10;
            localStorage.setItem('score', score);
            if (scoreElement) scoreElement.innerText = `Skor: ${score}`;
          }
          if (wordElement) wordElement.classList.add('found');
        }
      }
      document.querySelectorAll('.selected').forEach(c => c.classList.remove('selected'));
      checkLevelCompletion();
    }

    const gridEl = document.getElementById('grid');
    if (gridEl) {
      gridEl.addEventListener('mousedown', handleStart);
      gridEl.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);

      gridEl.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleStart(e.touches[0]);
      }, { passive: false });

      gridEl.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
        handleMove({ target: touch });
      }, { passive: false });

      document.addEventListener('touchend', handleEnd);
    }

    function handleStart(e) {
      const cell = e.target;
      if (!cell || !cell.classList.contains('cell')) return;
      isDragging = true;
      dragPath = [];
      lastRow = parseInt(cell.dataset.row);
      lastCol = parseInt(cell.dataset.col);
      cell.classList.add('selected');
      dragPath.push([lastRow, lastCol]);
    }

    function handleMove(e) {
      if (!isDragging) return;
      const cell = e.target;
      if (!cell || !cell.classList.contains('cell')) return;
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      if (row === lastRow && col === lastCol) return;

      const dr = Math.abs(row - lastRow);
      const dc = Math.abs(col - lastCol);
      if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1) || (dr === 1 && dc === 1)) {
        cell.classList.add('selected');
        dragPath.push([row, col]);
        lastRow = row;
        lastCol = col;
      }
    }

    function handleEnd() {
      isDragging = false;
      checkWordDrag();
      dragPath = [];
      lastRow = null;
      lastCol = null;
    }
  }

  loadLevel(level);

  if (nextLevelBtn) {
    nextLevelBtn.onclick = async () => {
      const completedLevels = new Set(JSON.parse(localStorage.getItem('completed_levels')) || []);
      completedLevels.add(level);
      localStorage.setItem('completed_levels', JSON.stringify(Array.from(completedLevels)));

      level++;
      localStorage.setItem('last_level', level);
      if (levelDisplayElement) levelDisplayElement.innerText = `Level ${level}`;
      if (nextLevelBtn) nextLevelBtn.style.display = 'none';

      await fetch('https://gamewordmaze.nasiuduklapangantenis.my.id/api/user/last-level', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, level })
      });

      window.location.hash = '#level-select';
    };
  }

  const logoutButton = document.getElementById('logout');
  if (logoutButton) {
    logoutButton.onclick = () => {
      localStorage.clear();
      window.location.hash = '#auth';
    };
  }
}