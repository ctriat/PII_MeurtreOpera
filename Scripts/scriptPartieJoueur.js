//36 longueur 22 largeur
function generationPlateau() {
  for (let x = 0; x < 22; x++) {
    for (let y = 0; y < 36; y++) {
      let casePlateau = document.createElement('div');
      casePlateau.id = x + ';' + y;
      definitionPieces(x, y, casePlateau);
      //casePlateau.innerHTML = casePlateau.id;
      document.getElementById('plateau').appendChild(casePlateau);
    }
  }
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

generationPlateau();
