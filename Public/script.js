document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const result = await response.json();
  if (result.status === 'success') {
    alert('Connexion réussie !');
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('message-form').style.display = 'block';
  } else {
    alert('Identifiants invalides.');
  }
});

document.getElementById('message-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = document.getElementById('message').value;

  const response = await fetch('/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'utilisateur', message })
  });

  const result = await response.json();
  if (result.status === 'success') {
    alert('Message envoyé !');
    document.getElementById('message').value = '';
  } else {
    alert('Erreur lors de l\'envoi du message.');
  }
});
