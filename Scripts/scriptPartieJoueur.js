//41 longueur 22 largeur
function generationPlateau() {
  for (let x = 0; x < 22; x++) {
    for (let y = 0; y < 41; y++) {
      let casePlateau = document.createElement('div');
      casePlateau.id = x + ';' + y;
      casePlateau.className = 'case';
      //casePlateau.innerHTML = casePlateau.id;
      document.getElementById('plateau').appendChild(casePlateau);
    }
  }
}

generationPlateau();
