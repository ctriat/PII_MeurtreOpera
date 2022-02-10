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
    casePlateau.className = 'balcon';
  } else if (y < 15 && x < 3) {
    casePlateau.className = 'bar';
  } else if (y < 31 && x < 3) {
    casePlateau.className = 'coulisseJardin';
  } else if (y >= 31 && x < 7) {
    casePlateau.className = 'salleDecors';
  } else if (y >= 31 && x >= 15) {
    casePlateau.className = 'salleCostumes';
  } else if (y >= 31) {
    casePlateau.className = 'loges';
  } else if (y >= 15 && x >= 19) {
    casePlateau.className = 'coulisseCour';
  } else if (y >= 5 && y < 13 && x >= 6 && x < 16) {
    casePlateau.className = 'fosse';
  } else if (y >= 17 && y < 29 && x >= 7 && x < 15) {
    casePlateau.className = 'scene';
  } else {
    casePlateau.className = 'case';
  }
}

generationPlateau();
