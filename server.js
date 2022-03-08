const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Pages/partieJoueur.html');
});

let numJoueur = 1;
let listeArmes = ['Barre', 'Collants', 'Couteau', 'Pointes', 'Projecteur', 'Ruban'];
io.on('connection', (socket) => {
  console.log('a user connected');
  io.to(socket.id).emit('attribNumJ', numJoueur);
  numJoueur++;
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('demDistrib', (msg) => {
    console.log('distribution des cartes ' + msg);
    io.to(socket.id).emit('attribNumJ', numJoueur);
  });
});

server.listen(3000);
