const fastify = require('fastify')();
const path = require('path');
const fs = require('fs');

// Charger les données utilisateurs et messages
const usersPath = path.join(__dirname, 'user.json');
const messagesPath = path.join(__dirname, 'messages.json');

let users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
let messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));

// Route pour servir les fichiers statiques
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/',
});

// Route pour gérer la connexion
fastify.post('/login', (req, reply) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    reply.send({ status: 'success', message: 'Connexion réussie !' });
  } else {
    reply.code(401).send({ status: 'error', message: 'Identifiants invalides.' });
  }
});

// Route pour envoyer un message
fastify.post('/message', (req, reply) => {
  const { username, message } = req.body;

  if (!username || !message) {
    return reply.code(400).send({ status: 'error', message: 'Données manquantes.' });
  }

  const newMessage = { username, message, timestamp: new Date().toISOString() };
  messages.push(newMessage);

  fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
  reply.send({ status: 'success', message: 'Message envoyé !' });
});

// Démarrer le serveur
fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) throw err;
  console.log(`Serveur en cours d'exécution sur ${address}`);
});
