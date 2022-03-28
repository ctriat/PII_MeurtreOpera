// Pop up validation accusation joueur
creationCarte('Armes', 'Pointes', 'cartesValidAccuJ');
creationCarte('Armes', 'Projecteur', 'cartesValidAccuJ');
creationCarte('Armes', 'Pointes', 'cartesValidAccuJ');

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
  //Chaque element est un couple type de carte / nom de carte
  let carteSelec = recupCartesSelect(cartes);
  socket.emit('envoiHypoJ', carteSelec);
}

function validHypoA() {
  masquagePopUp('popUpHypoA');
  let cartes = document.getElementById('popUpHypoA').getElementsByClassName('carteSelec');
  let cartesSelect = recupCartesSelect(cartes);
  let cartesSuppr = document.getElementById('popUpHypoA').getElementsByClassName('carte');
  while (cartesSuppr.length > 0) cartesSuppr[0].remove();
  socket.emit('envoiRepHypoA', cartesSelect, numJoueur);
}

function validRepHypoJ() {
  masquagePopUp('popUpRepHypoJ');
  let cartesSuppr = document.getElementById('popUpRepHypoJ').getElementsByClassName('sectionCarteRepHypoJ');
  while (cartesSuppr.length > 0) cartesSuppr[0].remove();
}

function validAccu() {
  masquagePopUp('popUpAccuJ');
  let cartes = document.getElementById('popUpAccuJ').getElementsByClassName('carteSelec');
  //Chaque element est un couple type de carte / nom de carte
  let carteSelec = recupCartesSelect(cartes);
}

function recupCartesSelect(cartes) {
  let carteSelec = [];
  Array.from(cartes).forEach(function (c) {
    let carte = { typeCarte: c.dataset.typeCarte, nomCarte: c.dataset.nomCarte };
    carteSelec.push(carte);
    c.classList.remove('carteSelec');
  });
  return carteSelec;
}

// ---- Reponses serveur ----

//Demande de la liste des cartes du joueur
socket.on('listeCartes', (listeC) => {
  listeC.forEach((carte) => {
    ajoutMessage(carte.nomCarte);
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
  affichagePopUp('popUpHypoA');
  hypo.forEach((carte) => {
    creationCarte(carte.typeCarte, carte.nomCarte, 'cartesHypoDA');
  });
  socket.emit('demCartesCorrespHypoA', hypo, numJoueur);
});

//Recuperation cartes possedes etant dans hypo adversaire
socket.on('recupCartesCorrespHypoA', (cartes) => {
  cartes.forEach((carte) => {
    creationCarte(carte.typeCarte, carte.nomCarte, 'cartesHypoDJ').addEventListener('click', clicCarte);
  });
});

//Reponse a l'hypothese posee
socket.on('repHypo', (rep) => {
  affichagePopUp('popUpRepHypoJ');
  rep.forEach((repJ) => {
    repJ.cartes.forEach((carte) => {
      ajoutCarteRepHypoJ('J' + repJ.numJ, carte.typeCarte, carte.nomCarte, 'cartesRepHypoJ');
    });
  });
});

initPopUp();
