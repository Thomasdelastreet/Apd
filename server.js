const fastify = require('fastify')({ logger: true });
const path = require('path');
const fs = require('fs');

// Charger les bases de données JSON
const usersDB = JSON.parse(fs.readFileSync('./user.json', 'utf-8'));
const messagesDBPath = './messages.json';

// Plugin pour servir les fichiers statiques
const fastifyStatic = require('@fastify/static');
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

// Route pour la page principale
fastify.get('/', async (request, reply) => {
  reply.sendFile('index.html');
});

// Route pour se connecter
fastify.post('/login', async (request, reply) => {
  const { username, password } = request.body;

  const user = usersDB.users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    return { success: true, message: 'Connexion réussie !' };
  } else {
    return { success: false, message: 'Identifiants incorrects.' };
  }
});

// Route pour envoyer un message
fastify.post('/message', async (request, reply) => {
  const { username, message } = request.body;

  if (!username || !message) {
    return { success: false, message: 'Données manquantes.' };
  }

  // Charger les messages existants et ajouter le nouveau
  const messagesDB = JSON.parse(fs.readFileSync(messagesDBPath, 'utf-8'));
  messagesDB.messages.push({ username, message, timestamp: new Date() });

  fs.writeFileSync(messagesDBPath, JSON.stringify(messagesDB, null, 2));

  return { success: true, message: 'Message sauvegardé !' };
});

// Démarrer le serveur
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`Serveur démarré sur : ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
