// js/auth.js
function initAuthPage() {
  let isLogin = true;

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const formTitle = document.getElementById('formTitle');
  const toggleLink = document.querySelector('.toggle-link');

  if (!loginForm || !registerForm || !formTitle || !toggleLink) {
      console.error("Elemen form autentikasi tidak ditemukan. Pastikan auth.html sudah dimuat.");
      return;
  }

  function toggleForm() {
    isLogin = !isLogin;
    loginForm.style.display = isLogin ? 'block' : 'none';
    registerForm.style.display = isLogin ? 'none' : 'block';
    formTitle.textContent = isLogin ? 'Login WordMaze' : 'Daftar WordMaze';
    toggleLink.textContent = isLogin ? 'Daftar di sini' : 'Login di sini';
  }

  toggleLink.addEventListener('click', toggleForm);

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const response = await fetch('wordmaze.nasiuduklapangantenis.my.id/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        alert('Login berhasil!');
        window.location.hash = '#level-select';
      } else {
        alert(`Login gagal: ${data.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Terjadi kesalahan saat mencoba login. Pastikan server backend berjalan.');
    }
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    try {
      const response = await fetch('wordmaze.nasiuduklapangantenis.my.id/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        alert('Registrasi berhasil! Anda sudah login.');
        window.location.hash = '#level-select';
      } else {
        alert(`Registrasi gagal: ${data.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Terjadi kesalahan saat mencoba registrasi. Pastikan server backend berjalan.');
    }
  });
}
