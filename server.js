const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Pages/partieJoueur.html');
});

let numJoueur = 1; //Numero du prochain joueur connecté
let nbConnect = 0; //Nombre de joueurs connectés
let listeArmes = ['Barre', 'Collants', 'Couteau', 'Pointes', 'Projecteur', 'Ruban'];
let listePersonnages = ['Barmaid', 'Chorégraphe', 'Couturière', 'Danseuse', 'Gérant', 'Technicien'];
let listeSalles = [
  'Balcon',
  'Fosse',
  'Scène',
  'Bar',
  'Coulisses côté jardin',
  'Coulisses côté cour',
  'Salle des décors',
  'Loges',
  'Salle des costumes',
];
let nbADistrib = 0;
let nbPDistrib = 0;
let nbSDistrib = 0;
let listeCartesJ = []; //Liste des cartes des joueurs avec dans la premiere case celle du joueur 1...
let listeCartesATrouver = [];
let carteDistrib = [];
let carteDistribMaxLong = listeArmes.length + listePersonnages.length + listeSalles.length;
let tourNumJ = 1; //Numero du joueur dont c'est le tour actuellement
let positionJ = []; // Premiere val du tab correspond au joueur 1, deuxieme joueur 2...
let repHypoA = []; //Stocke les réponses a l'hypothese du joueur dont c'est le tour
let idJCourant = null; //Identifiant socket du joueur dont c'est le tour

//Choix cartes a trouver
choixCarte('Armes', listeArmes, listeCartesATrouver);
nbADistrib++;
choixCarte('Personnages', listePersonnages, listeCartesATrouver);
nbPDistrib++;
choixCarte('Salles', listeSalles, listeCartesATrouver);
nbSDistrib++;

console.log(listeCartesATrouver);

io.on('connection', (socket) => {
  console.log('a user connected');
  nbConnect++;

  //Attribution numéro
  io.to(socket.id).emit('attribNumJ', numJoueur);
  numJoueur++;

  //Definition de si c'est son tour ou non
  io.to(socket.id).emit('changTour', tourNumJ);

  //Distrib carte
  let listeCartes = [];
  let i = 0;
  //3 joueurs donc 6 cartes
  while (i < 6 && carteDistrib.length < carteDistribMaxLong) {
    //Random entre 0 et 2
    let numTab = Math.floor(Math.random() * 3);
    if (numTab == 0 && nbADistrib < listeArmes.length) {
      choixCarte('Armes', listeArmes, listeCartes);
      nbADistrib++;
      i++;
    } else if (numTab == 1 && nbPDistrib < listePersonnages.length) {
      choixCarte('Personnages', listePersonnages, listeCartes);
      nbPDistrib++;
      i++;
    } else if (nbSDistrib < listeSalles.length) {
      choixCarte('Salles', listeSalles, listeCartes);
      nbSDistrib++;
      i++;
    }
  }
  listeCartesJ.push(listeCartes);
  io.to(socket.id).emit('distribCartes', listeCartes);

  //Envoi d'un message aux autres joueurs
  socket.on('envoiMsg', (msg) => {
    socket.broadcast.emit('recepMsg', msg);
  });

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

  //Modification position joueur
  socket.on('modifPosJ', (idJ, idCase) => {
    positionJ[idJ - 1] = idCase;
    socket.broadcast.emit('modifPosA', idJ, idCase);
  });

  /*//Demande de la position du joueur
  socket.on('demPosJ', (idJ) => {
    io.to(socket.id).emit('recupPosJ', positionJ[idJ - 1]);
  });*/

  //Fin du tour du joueur actuel
  socket.on('finTour', () => {
    if (tourNumJ == 3) {
      tourNumJ = 1;
    } else {
      tourNumJ++;
    }
    io.sockets.emit('changTour', tourNumJ);
  });

  //Envoi de l'hypothèse du joueur
  socket.on('envoiHypoJ', (hypo) => {
    idJCourant = socket.id;
    socket.broadcast.emit('recupHypoA', hypo);
  });

  //Envoi des cartes correspondantes à l'hypo du joueur en fonction de son num
  socket.on('demCartesCorrespHypoA', (hypo, numJoueur) => {
    let cartes = listeCartesJ[numJoueur - 1];
    let cartesSimil = [];
    cartes.forEach((cJ) => {
      hypo.forEach((cHypo) => {
        if (cJ.nomCarte == cHypo.nomCarte) cartesSimil.push(cJ);
      });
    });
    io.to(socket.id).emit('recupCartesCorrespHypoA', cartesSimil);
  });

  //Recuperation rep hypo adversaire
  socket.on('envoiRepHypoA', (cartes, numJoueur) => {
    repHypoA.push({ numJ: numJoueur, cartes: cartes });
    if (nbConnect - 1 <= repHypoA.length) {
      io.to(idJCourant).emit('repHypo', repHypoA);
      repHypoA = [];
      idJCourant = null;
    }
  });

  //Verification cartes accusation sont les mêmes que celles à trouver
  socket.on('verifAccu', (cartes) => {
    let valide = true;
    cartes.forEach((c) => {
      if (!listeCartesATrouver.some((cTrouv) => cTrouv.nomCarte == c.nomCarte)) {
        valide = false;
      }
    });
    io.to(socket.id).emit('validAccu', valide, listeCartesATrouver);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    nbConnect--;
  });
});

function choixCarte(type, liste, lCartes) {
  let carte = {
    typeCarte: type,
    nomCarte: '',
  };
  let carteChoisie;
  do {
    //Random entre 0 et 5 (nombre d'éléments dans les tableaux de carte)
    let nbMaxElem = 6;
    //Random entre 0 et 8 si c'est les salles
    if (type == 'Salles') {
      nbMaxElem = 9;
    }
    carteChoisie = liste[Math.floor(Math.random() * nbMaxElem)];
  } while (carteDistrib.includes(carteChoisie));
  carte.nomCarte = carteChoisie;
  carteDistrib.push(carteChoisie);
  lCartes.push(carte);
}

server.listen(3000);
