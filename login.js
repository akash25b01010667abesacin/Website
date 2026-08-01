const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const USER_KEY = 'chourasiaUser';

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  loginMessage.textContent = '';

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      loginMessage.textContent = data.error || 'Invalid credentials. Please try again.';
      loginMessage.style.color = '#b91c1c';
      return;
    }

    localStorage.setItem(USER_KEY, JSON.stringify(data));
    loginMessage.textContent = 'Login successful. Redirecting...';
    loginMessage.style.color = '#0f766e';
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 900);
  } catch (error) {
    loginMessage.textContent = 'Unable to login. Please try again later.';
    loginMessage.style.color = '#b91c1c';
  }
});
