// Pop up hypothese adversaire
creationCarte('Armes', 'Pointes', 'cartesHypoDA');
creationCarte('Armes', 'Projecteur', 'cartesHypoDA');
creationCarte('Armes', 'Pointes', 'cartesHypoDA');
creationCarte('Armes', 'Projecteur', 'cartesHypoDJ');
creationCarte('Armes', 'Pointes', 'cartesHypoDJ');
creationCarte('Armes', 'Projecteur', 'cartesHypoDJ');

// Pop up validation accusation joueur
creationCarte('Armes', 'Pointes', 'cartesValidAccuJ');
creationCarte('Armes', 'Projecteur', 'cartesValidAccuJ');
creationCarte('Armes', 'Pointes', 'cartesValidAccuJ');

// Pop up reponse hypotheses joueur
ajoutCarteRepHypoJ('J1', 'Armes', 'Pointes', 'cartesRepHypoJ');
ajoutCarteRepHypoJ('J2', 'Armes', 'Projecteur', 'cartesRepHypoJ');
ajoutCarteRepHypoJ('J3', 'Armes', 'Pointes', 'cartesRepHypoJ');

function initPopUp() {
  socket.emit('demArmesInit');
  socket.emit('demPersoInit');
}

function ajoutCarteRepHypoJ(nomJoueur, typeCarte, nomCarte, nomSection) {
  let sectionCarte = document.createElement('div');
  sectionCarte.id = nomJoueur + '' + nomCarte;
  sectionCarte.className = 'sectionCarteRepHypoJ';
  document.getElementById(nomSection).appendChild(sectionCarte);
  creationCarte(typeCarte, nomCarte, sectionCarte.id);
  afficherNomJoueur(nomJoueur, sectionCarte);
}

function afficherNomJoueur(nomJoueur, nomSection) {
  let joueur = document.createElement('span');
  joueur.innerHTML = nomJoueur;
  nomSection.appendChild(joueur);
}

function affichagePopUp(idPopUp) {
  document.getElementById('fondPopUp').classList.remove('cache');
  document.getElementById(idPopUp).classList.remove('cache');
}

function masquagePopUp(idPopUp) {
  document.getElementById('fondPopUp').classList.add('cache');
  document.getElementById(idPopUp).classList.add('cache');
}

function clicCarte() {
  if (this.classList.contains('carteSelec')) {
    this.classList.remove('carteSelec');
  } else {
    this.classList.add('carteSelec');
  }
}

function validHypoJ() {
  masquagePopUp('popUpHypoJ');
  let cartes = document.getElementById('popUpHypoJ').getElementsByClassName('carteSelec');
  let nomCarteSelec = [];
  Array.from(cartes).forEach(function (c) {
    nomCarteSelec.push(c.dataset.nomCarte);
    c.classList.remove('carteSelec');
  });
  socket.emit('envoiHypoJ', nomCarteSelec);
}

// ---- Reponses serveur ----

//Demande de la liste des cartes du joueur
socket.on('listeCartes', (listeC) => {
  listeC.forEach((carte) => {
    ajoutMessage(carte.nom);
  });
});

//Demande de la liste des armes pour initialiser les pop up
socket.on('listeArmesInit', (listeA) => {
  listeA.forEach((arme) => {
    creationCarte('Armes', arme, 'cartesHypoA').addEventListener('click', clicCarte);
    creationCarte('Armes', arme, 'cartesAccuA').addEventListener('click', clicCarte);
  });
});

//Demande de la liste des personnages pour initialiser les pop up
socket.on('listePersoInit', (listeP) => {
  listeP.forEach((perso) => {
    creationCarte('Personnages', perso, 'cartesHypoP').addEventListener('click', clicCarte);
    creationCarte('Personnages', perso, 'cartesAccuP').addEventListener('click', clicCarte);
  });
});

//Recuperation hypothese adversaire
socket.on('recupHypoA', (hypo) => {
  console.log(hypo);
});

initPopUp();
