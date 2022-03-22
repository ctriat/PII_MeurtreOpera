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

//Demande de la liste des cartes du joueur
socket.on('listeCartes', (listeC) => {
  listeC.forEach((carte) => {
    ajoutMessage(carte.nom);
  });
});

//Demande de la liste des armes pour initialiser les pop up
socket.on('listeArmesInit', (listeA) => {
  listeA.forEach((arme) => {
    creationCarte('Armes', arme, 'cartesHypoA');
    creationCarte('Armes', arme, 'cartesAccuA');
  });
});

//Demande de la liste des personnages pour initialiser les pop up
socket.on('listePersoInit', (listeP) => {
  listeP.forEach((perso) => {
    creationCarte('Personnages', perso, 'cartesHypoP');
    creationCarte('Personnages', perso, 'cartesAccuP');
  });
});

initPopUp();
