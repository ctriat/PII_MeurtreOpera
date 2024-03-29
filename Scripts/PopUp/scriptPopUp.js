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

// --- Hypothese ---

function affHypoJ() {
  if (
    salleActu != null &&
    !document.getElementById('sectionTour').classList.contains('desact') &&
    !document.getElementById('btnHypo').classList.contains('desact')
  ) {
    affichagePopUp('popUpHypoJ');
    socket.emit('envoiMsg', `Le joueur ${numJoueur} fait une hypothèse`);
  }
}

function validHypoJ() {
  masquagePopUp('popUpHypoJ');
  let cartes = document.getElementById('popUpHypoJ').getElementsByClassName('carteSelec');
  //Chaque element est un couple type de carte / nom de carte
  let carteSelec = recupCartesSelect(cartes);
  if (salleActu != null) {
    carteSelec.push(recupCarteSalle(salleActu));
  }
  socket.emit('envoiHypoJ', carteSelec, numJoueur);
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
  let cartesSuppr = document
    .getElementById('popUpRepHypoJ')
    .getElementsByClassName('sectionCarteRepHypoJ');
  while (cartesSuppr.length > 0) cartesSuppr[0].remove();
  socket.emit('finTour');
}

// --- Accusation ---

function affAccu() {
  if (
    salleActu != null &&
    !document.getElementById('sectionTour').classList.contains('desact') &&
    !document.getElementById('btnAccu').classList.contains('desact')
  ) {
    affichagePopUp('popUpAccuJ');
    socket.emit('envoiMsg', `Le joueur ${numJoueur} fait une accusation`);
  }
}

function validAccu() {
  masquagePopUp('popUpAccuJ');
  let cartes = document.getElementById('popUpAccuJ').getElementsByClassName('carteSelec');
  //Chaque element est un couple type de carte / nom de carte
  let carteSelec = recupCartesSelect(cartes);
  if (salleActu != null) {
    carteSelec.push(recupCarteSalle(salleActu));
  }
  socket.emit('verifAccu', carteSelec);
}

function validValidationAccu() {
  masquagePopUp('popUpValidAccuJ');
  let cartesSuppr = document.getElementById('popUpValidAccuJ').getElementsByClassName('carte');
  while (cartesSuppr.length > 0) cartesSuppr[0].remove();
  //Valide la fermeture de la pop up seulement si il a perdu
  socket.emit('ajoutPerdu', numJoueur);
  socket.emit('finTour');
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

function recupCarteSalle(nomSalle) {
  let nomC = '';
  switch (nomSalle) {
    case 'balcon':
      nomC = 'Balcon';
      break;
    case 'bar':
      nomC = 'Bar';
      break;
    case 'coulisseJardin':
      nomC = 'Coulisses côté jardin';
      break;
    case 'salleDecors':
      nomC = 'Salle des décors';
      break;
    case 'salleCostumes':
      nomC = 'Salle des costumes';
      break;
    case 'loges':
      nomC = 'Loges';
      break;
    case 'coulisseCour':
      nomC = 'Coulisses côté cour';
      break;
    case 'fosse':
      nomC = 'Fosse';
      break;
    case 'scene':
      nomC = 'Scène';
      break;
  }
  if (nomC != '') {
    return {
      typeCarte: 'Salles',
      nomCarte: nomC,
    };
  }
}

// ---- Reponses serveur ----

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
socket.on('recupHypoA', (hypo, idJ) => {
  affichagePopUp('popUpHypoA');
  document
    .getElementById('popUpHypoA')
    .getElementsByClassName('titrePopUp')[0].innerText = `Réponse à l'hypothèse du joueur ${idJ}`;
  hypo.forEach((carte) => {
    creationCarte(carte.typeCarte, carte.nomCarte, 'cartesHypoDA');
  });
  socket.emit('demCartesCorrespHypoA', hypo, numJoueur);
});

//Recuperation cartes possedes etant dans hypo adversaire
socket.on('recupCartesCorrespHypoA', (cartes) => {
  cartes.forEach((carte) => {
    creationCarte(carte.typeCarte, carte.nomCarte, 'cartesHypoDJ').addEventListener(
      'click',
      clicCarte
    );
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

//Reponse à l'accusation en affichant si le joueur est gagnant ou non
socket.on('validAccu', (valide, cartesATrouver) => {
  if (valide) {
    socket.emit('demFinPartie', numJoueur);
  } else {
    affichagePopUp('popUpValidAccuJ');
    cartesATrouver.forEach((carte) => {
      creationCarte(carte.typeCarte, carte.nomCarte, 'cartesValidAccuJ');
    });
    document.getElementById('texteValidAccuJ').innerHTML = 'Vous avez perdu !';
    socket.emit('envoiMsg', `Le joueur ${numJoueur} a perdu`);
  }
});

//Fin de la partie
socket.on('finPartie', (idJ, cartesATrouver) => {
  affichagePopUp('popUpFinPartie');
  cartesATrouver.forEach((carte) => {
    creationCarte(carte.typeCarte, carte.nomCarte, 'cartesFinPartie');
  });
  document.getElementById('texteFinPartie').innerText = `Le joueur ${idJ} a gagné`;
});

initPopUp();
