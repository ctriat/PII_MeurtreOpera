//36 longueur 22 largeur
let plateau = [];

function generationPlateau() {
  for (let x = 0; x < 22; x++) {
    for (let y = 0; y < 36; y++) {
      let casePlateau = document.createElement('div');
      casePlateau.id = x + ';' + y;
      definitionPieces(x, y, casePlateau);
      definitionPortes(x, y, casePlateau);
      correctionBordure(x, y, casePlateau);
      plateau.push(casePlateau);
      //casePlateau.innerHTML = casePlateau.id;
      document.getElementById('plateau').appendChild(casePlateau);
    }
  }

  let yJoueur = 7;
  for (let i = 1; i <= 4; i++) {
    definitionJoueur(i, 21, yJoueur++);
  }
}

function recupererCase(id) {
  for (let casePlateau of plateau) {
    if (casePlateau.id == id) {
      return casePlateau;
    }
  }
  return null;
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
    casePlateau.className += ' bordureHaut';
  }
}

function definitionBordureDroite(y, nbColonne, casePlateau) {
  if (y == nbColonne) {
    casePlateau.className += ' bordureDroite';
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
  casePlateau.className += ' porte';

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
      casePlateau.style.height = '19px';
      break;
    //Porte sur le bas de la case
    case 'b':
      casePlateau.style.borderBottom = 'none';
      break;
  }
}

function correctionBordure(x, y, casePlateau) {
  //Bordure bas de la salle
  let caseHaut = recupererCase(x - 1 + ';' + y);
  if (caseHaut && caseHaut.classList.contains('salle') && !caseHaut.classList.contains('porte')) {
    if (!casePlateau.classList.contains('salle')) {
      casePlateau.style.borderTop = '1px solid black';
      casePlateau.style.height = '18px';
    }
  }

  //Bordure gauche de la salle
  let caseGauche = recupererCase(x + ';' + (y - 1));
  if (caseGauche && casePlateau.classList.contains('salle') && !casePlateau.classList.contains('porte')) {
    if (!caseGauche.classList.contains('salle')) {
      caseGauche.style.borderRight = '1px solid black';
    }
  }
}

function definitionJoueur(id, x, y) {
  let joueur = document.createElement('div');
  joueur.id = id;
  joueur.className = 'joueur';
  joueur.textContent = id;
  document.getElementById(x + ';' + y).appendChild(joueur);
}

generationPlateau();
