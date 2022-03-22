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
let listePersonnages = ['Barmaid', 'Chorégraphe', 'Couturière', 'Danseuse', 'Gérant', 'Technicien'];
let listeCartesJ = [];
let carteDistrib = [];
let carteDistribMaxLong = listeArmes.length + listePersonnages.length;

io.on('connection', (socket) => {
  console.log('a user connected');

  //Attribution numéro
  io.to(socket.id).emit('attribNumJ', numJoueur);
  numJoueur++;

  //Distrib carte
  let listeCartes = [];
  let i = 0;
  while (i < 6 && carteDistrib.length < carteDistribMaxLong) {
    //Random entre 0 et 1
    let numTab = Math.floor(Math.random() * 2);
    if (numTab == 0) {
      choixCarte('Armes', listeArmes, listeCartes);
    } else {
      choixCarte('Personnages', listePersonnages, listeCartes);
    }
    i++;
  }
  listeCartesJ.push(listeCartes);
  io.to(socket.id).emit('distribCartes', listeCartes);

  //Demande de récupérer sa liste de cartes
  socket.on('demListeCartes', (idJ) => {
    io.to(socket.id).emit('listeCartes', listeCartesJ[idJ - 1]);
  });

  //Demande de récupérer les armes
  socket.on('demArmesInit', () => {
    io.to(socket.id).emit('listeArmesInit', listeArmes);
  });

  //Demande de récupérer les personnages
  socket.on('demPersoInit', () => {
    io.to(socket.id).emit('listePersoInit', listePersonnages);
  });

  //Envoi de l'hypothèse du joueur
  socket.on('envoiHypoJ', (hypo) => {
    socket.broadcast.emit('recupHypoA', hypo);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

function choixCarte(type, liste, lCartes) {
  let carte = {
    type: type,
    nom: '',
  };
  let carteChoisie;
  do {
    //Random entre 0 et 5 (nombre d'éléments dans les tableaux de carte)
    carteChoisie = liste[Math.floor(Math.random() * 6)];
  } while (carteDistrib.includes(carteChoisie) && carteDistrib.length != carteDistribMaxLong);
  carte.nom = carteChoisie;
  carteDistrib.push(carteChoisie);
  lCartes.push(carte);
}

server.listen(3000);
