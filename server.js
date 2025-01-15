const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');
const fastifyStatic = require('fastify-static');

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'), // Assurez-vous que votre index.html est dans le dossier 'public'
    prefix: '/', // Chemin où le fichier sera accessible
});

// Fichiers JSON pour les utilisateurs et les messages
const USERS_FILE = './users.json';
const MESSAGES_FILE = './messages.json';

// Fonction pour lire un fichier JSON
function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// Fonction pour écrire dans un fichier JSON
function writeJson(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 4));
}

// Route de connexion
fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body;
    const users = readJson(USERS_FILE).users;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        return { message: 'Connexion réussie' };
    } else {
        reply.code(401);
        return { error: 'Nom d\'utilisateur ou mot de passe incorrect' };
    }
});

// Route pour sauvegarder un message
fastify.post('/save_message', async (request, reply) => {
    const { message } = request.body;
    const messages = readJson(MESSAGES_FILE).messages;

    messages.push({ message });
    writeJson(MESSAGES_FILE, { messages });

    return { message: 'Message sauvegardé avec succès' };
});

// Démarrer le serveur Fastify
fastify.listen(3000, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Serveur en cours d'exécution sur ${address}`);
});
