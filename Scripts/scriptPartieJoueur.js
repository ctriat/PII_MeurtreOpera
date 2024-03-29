var socket = io();

// ---- Initialisation de la partie ----
//36 longueur 22 largeur
let plateau = [];
let numJoueur;
let salleActu;
let deplPion = false;

function generationPlateau() {
  for (let x = 0; x < 22; x++) {
    for (let y = 0; y < 36; y++) {
      let casePlateau = document.createElement('div');
      casePlateau.id = x + ';' + y;
      casePlateau.addEventListener('click', clicCase);
      definitionPieces(x, y, casePlateau);
      definitionPortes(x, y, casePlateau);
      correctionBordure(x, y, casePlateau);
      plateau.push(casePlateau);
      document.getElementById('plateau').appendChild(casePlateau);
    }
  }

  //Creation des joueurs
  for (let i = 1; i <= 3; i++) {
    socket.emit('demPosJ', i);
  }

  //Creation des cartes du joueur
  socket.on('distribCartes', (listeCartes) => {
    listeCartes.forEach((carte) => {
      creationCarte(carte.typeCarte, carte.nomCarte, 'sectionCartes');
    });
  });

  socket.on('attribNumJ', (numJ) => {
    numJoueur = numJ;
    ajoutMessage(`Bienvenue dans la partie de cluedo, vous êtes le joueur ${numJoueur}`);
  });
}

function definitionPieces(x, y, casePlateau) {
  if (y < 3) {
    casePlateau.className = 'balcon salle';
    definitionBordureDroite(y, 2, casePlateau);
  } else if (y < 15 && x < 3) {
    casePlateau.className = 'bar salle';
    definitionBordureDroite(y, 14, casePlateau);
  } else if (y < 31 && x < 3) {
    casePlateau.className = 'coulisseJardin salle';
    definitionBordureDroite(y, 30, casePlateau);
  } else if (y >= 31 && x < 7) {
    casePlateau.className = 'salleDecors salle';
  } else if (y >= 31 && x >= 15) {
    casePlateau.className = 'salleCostumes salle';
    definitionBordureHaut(x, 15, casePlateau);
  } else if (y >= 31) {
    casePlateau.className = 'loges salle';
    definitionBordureHaut(x, 7, casePlateau);
  } else if (y >= 15 && x >= 19) {
    casePlateau.className = 'coulisseCour salle';
    definitionBordureHaut(x, 19, casePlateau);
    definitionBordureDroite(y, 30, casePlateau);
  } else if (y >= 5 && y < 13 && x >= 6 && x < 16) {
    casePlateau.className = 'fosse salle';
    definitionBordureHaut(x, 6, casePlateau);
    definitionBordureDroite(y, 12, casePlateau);
  } else if (y >= 17 && y < 29 && x >= 7 && x < 15) {
    casePlateau.className = 'scene salle';
    definitionBordureHaut(x, 7, casePlateau);
    definitionBordureDroite(y, 28, casePlateau);
  } else {
    casePlateau.className = 'case';
  }
}

function definitionBordureHaut(x, nbLigne, casePlateau) {
  if (x == nbLigne) {
    casePlateau.classList.add('bordureHaut');
  }
}

function definitionBordureDroite(y, nbColonne, casePlateau) {
  if (y == nbColonne) {
    casePlateau.classList.add('bordureDroite');
  }
}

function definitionPortes(x, y, casePlateau) {
  //Portes balcon
  if (x == 4 || x == 17) {
    if (y == 2) {
      definitionPorte('d', casePlateau);
    } else if (y == 3) {
      definitionPorte('g', casePlateau);
    }
  }
  //Portes salle des décors, des costumes et loges
  if (x == 4 || x == 17 || x == 10) {
    if (y == 30) {
      definitionPorte('d', casePlateau);
    } else if (y == 31) {
      definitionPorte('g', casePlateau);
    }
  }
  //Porte bar
  else if (y == 13) {
    if (x == 2) {
      definitionPorte('b', casePlateau);
    } else if (x == 3) {
      definitionPorte('h', casePlateau);
    }
  }
  //Portes coulisses côté jardin et côté cour
  else if (y == 20) {
    if (x == 2 || x == 18) {
      definitionPorte('b', casePlateau);
    } else if (x == 3 || x == 19) {
      definitionPorte('h', casePlateau);
    }
  }
  //Porte fosse
  else if (y == 8) {
    if (x == 5 || x == 15) {
      definitionPorte('b', casePlateau);
    } else if (x == 6 || x == 16) {
      definitionPorte('h', casePlateau);
    }
  }
  //Porte scene
  else if (x == 11) {
    if (y == 16) {
      definitionPorte('d', casePlateau);
    } else if (y == 17) {
      definitionPorte('g', casePlateau);
    }
  } else if (y == 23) {
    if (x == 6 || x == 14) {
      definitionPorte('b', casePlateau);
    } else if (x == 7 || x == 15) {
      definitionPorte('h', casePlateau);
    }
  }
}

function definitionPorte(cotePorte, casePlateau) {
  casePlateau.classList.add('porte');

  switch (cotePorte) {
    //Porte sur le cote droit de la case
    case 'd':
      casePlateau.style.borderRight = 'none';
      break;
    //Porte sur le cote gauche de la case
    case 'g':
      casePlateau.style.borderLeft = 'none';
      break;
    //Porte sur le haut de la case
    case 'h':
      casePlateau.style.borderTop = 'none';
      casePlateau.style.height = 'var(--tailleSansBord)';
      break;
    //Porte sur le bas de la case
    case 'b':
      casePlateau.style.borderBottom = 'none';
      break;
  }
}

function correctionBordure(x, y, casePlateau) {
  //Bordure bas de la salle
  let caseHaut = document.getElementById(x - 1 + ';' + y);
  if (caseHaut && caseHaut.classList.contains('salle') && !caseHaut.classList.contains('porte')) {
    if (!casePlateau.classList.contains('salle')) {
      casePlateau.style.borderTop = '1px solid black';
    }
  }

  //Bordure gauche de la salle
  let caseGauche = document.getElementById(x + ';' + (y - 1));
  if (
    caseGauche &&
    casePlateau.classList.contains('salle') &&
    !casePlateau.classList.contains('porte')
  ) {
    if (!caseGauche.classList.contains('salle')) {
      caseGauche.style.borderRight = '1px solid black';
    }
  }
}

//Recuperation de la position du joueur
socket.on('recupPosJ', (id, pos) => {
  definitionJoueur(id, pos);
});

function definitionJoueur(id, pos) {
  let joueur = document.createElement('div');
  joueur.id = 'j' + id;
  joueur.className = 'joueur';
  joueur.textContent = id;
  document.getElementById(pos).appendChild(joueur);
}

function creationCarte(typeCarte, nomCarte, nomSection) {
  let carte = document.createElement('div');
  carte.className = 'carte';
  carte.dataset.nomCarte = nomCarte;
  carte.dataset.typeCarte = typeCarte;
  let img = document.createElement('img');
  img.src = '../Images/' + typeCarte + '/' + nomCarte + 'R.png';
  img.alt = nomCarte;
  carte.appendChild(img);
  let legende = document.createElement('div');
  legende.textContent = nomCarte;
  carte.appendChild(legende);
  document.getElementById(nomSection).appendChild(carte);
  return carte;
}

//Genere le plateau si le nombre maximum de connexions n'est pas atteint
socket.on('acceptConnect', (valide) => {
  if (valide) {
    generationPlateau();
  } else {
    document.body.innerText = 'Vous ne pouvez pas vous connecter il y a déjà 3 joueurs en ligne';
  }
});

// ---- En cours de jeu ----

function clicCase() {
  if (deplPion) {
    let idJ = 'j' + numJoueur;
    let idCase = this.id;
    deplacementJoueur(idJ, idCase);
    socket.emit('modifPosJ', numJoueur, idCase);
  }
}

function deplacementJoueur(idJ, idNCase) {
  let joueur = document.getElementById(idJ);
  let nouvCase = document.getElementById(idNCase);
  if (nouvCase.children.length == 0) {
    joueur.parentElement.removeChild(joueur);
    nouvCase.appendChild(joueur);
    if (idJ == 'j' + numJoueur) {
      document.getElementById('btnHypo').classList.remove('desact');
      document.getElementById('btnAccu').classList.remove('desact');
      if (nouvCase.classList.contains('salle')) {
        salleActu = nouvCase.classList[0];
        deplPion = false;
        ajoutMessage('Choisissez si vous voulez faire une hypothèse ou une accusation');
      } else {
        salleActu = null;
        socket.emit('finTour');
      }
    }
  }
}

//Modification de la position des adversaires
socket.on('modifPosA', (idJ, idCase) => {
  deplacementJoueur('j' + idJ, idCase);
});

//Changement de tour de jeu
socket.on('changTour', (tourNumJ) => {
  if (tourNumJ == numJoueur) {
    document.getElementById('sectionTour').classList.remove('desact');
    document.getElementById('btnHypo').classList.add('desact');
    document.getElementById('btnAccu').classList.add('desact');
    ajoutMessage("C'est à votre tour de jouer, lancez les dés afin de vous déplacer");
  } else {
    document.getElementById('btnDes').classList.remove('desact');
    deplPion = false;
    document.getElementById('sectionTour').classList.add('desact');
    ajoutMessage(`C'est au tour du joueur ${tourNumJ} de jouer`);
  }
});

function lanceDes() {
  if (
    !document.getElementById('sectionTour').classList.contains('desact') &&
    !document.getElementById('btnDes').classList.contains('desact')
  ) {
    let nbCases = Math.floor(Math.random() * 12) + 1;
    ajoutMessage(`Vous avancez de ${nbCases} cases`);
    socket.emit('envoiMsg', `Le joueur ${numJoueur} avance de ${nbCases} cases`);
    deplPion = true;
    document.getElementById('btnDes').classList.add('desact');
  }
}

function ajoutMessage(message) {
  let infosPartie = document.getElementById('infosPartie');
  infosPartie.innerHTML += '<br /> > ' + message;
  infosPartie.scrollTo(0, infosPartie.scrollHeight);
}

//Reception message
socket.on('recepMsg', (msg) => {
  ajoutMessage(msg);
});
