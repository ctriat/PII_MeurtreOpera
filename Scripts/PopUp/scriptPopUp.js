// Pop up hypothese adversaire
/*creationCarte('Armes', 'Pointes', 'cartesHypoDA');
creationCarte('Armes', 'Projecteur', 'cartesHypoDA');
creationCarte('Armes', 'Pointes', 'cartesHypoDA');*/
/*creationCarte('Armes', 'Projecteur', 'cartesHypoDJ');
creationCarte('Armes', 'Pointes', 'cartesHypoDJ');
creationCarte('Armes', 'Projecteur', 'cartesHypoDJ');*/

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
  //Chaque element est un couple type de carte / nom de carte
  let carteSelec = recupCartesSelect(cartes);
  socket.emit('envoiHypoJ', carteSelec);
}

function validHypoA() {
  masquagePopUp('popUpHypoA');
  let cartes = document.getElementById('popUpHypoA').getElementsByClassName('carteSelec');
  let cartesSelect = recupCartesSelect(cartes);
  console.log(cartesSelect);
  let cartesSuppr = document.getElementById('popUpHypoA').getElementsByClassName('carte');
  while (cartesSuppr.length > 0) cartesSuppr[0].remove();
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

initPopUp();
