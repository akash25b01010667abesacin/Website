const registerForm = document.getElementById('register-form');
const registerMessage = document.getElementById('register-message');
const USER_KEY = 'chourasiaUser';

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  registerMessage.textContent = '';

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      registerMessage.textContent = data.error || 'Registration failed.';
      registerMessage.style.color = '#b91c1c';
      return;
    }

    registerMessage.textContent = 'Registration successful. Redirecting to login...';
    registerMessage.style.color = '#0f766e';
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  } catch (error) {
    registerMessage.textContent = 'Unable to register. Please try again.';
    registerMessage.style.color = '#b91c1c';
  }
});
