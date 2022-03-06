// Pop up hypothese adversaire
creationCarte('Armes', 'Pointes', 'cartesHypoDA');
creationCarte('Armes', 'Projecteur', 'cartesHypoDA');
creationCarte('Armes', 'Pointes', 'cartesHypoDA');
creationCarte('Armes', 'Projecteur', 'cartesHypoDJ');
creationCarte('Armes', 'Pointes', 'cartesHypoDJ');
creationCarte('Armes', 'Projecteur', 'cartesHypoDJ');

// Pop up hypothese joueur
creationCarte('Armes', 'Pointes', 'cartesHypoP');
creationCarte('Armes', 'Projecteur', 'cartesHypoP');
creationCarte('Armes', 'Pointes', 'cartesHypoP');
creationCarte('Armes', 'Pointes', 'cartesHypoP');
creationCarte('Armes', 'Projecteur', 'cartesHypoP');
creationCarte('Armes', 'Pointes', 'cartesHypoP');
creationCarte('Armes', 'Projecteur', 'cartesHypoA');
creationCarte('Armes', 'Pointes', 'cartesHypoA');
creationCarte('Armes', 'Projecteur', 'cartesHypoA');
creationCarte('Armes', 'Projecteur', 'cartesHypoA');
creationCarte('Armes', 'Pointes', 'cartesHypoA');
creationCarte('Armes', 'Projecteur', 'cartesHypoA');

// Pop up accusation joueur
creationCarte('Armes', 'Pointes', 'cartesAccuP');
creationCarte('Armes', 'Projecteur', 'cartesAccuP');
creationCarte('Armes', 'Pointes', 'cartesAccuP');
creationCarte('Armes', 'Pointes', 'cartesAccuP');
creationCarte('Armes', 'Projecteur', 'cartesAccuP');
creationCarte('Armes', 'Pointes', 'cartesAccuP');
creationCarte('Armes', 'Projecteur', 'cartesAccuA');
creationCarte('Armes', 'Pointes', 'cartesAccuA');
creationCarte('Armes', 'Projecteur', 'cartesAccuA');
creationCarte('Armes', 'Projecteur', 'cartesAccuA');
creationCarte('Armes', 'Pointes', 'cartesAccuA');
creationCarte('Armes', 'Projecteur', 'cartesAccuA');

// Pop up validation accusation joueur
creationCarte('Armes', 'Pointes', 'cartesValidAccuJ');
creationCarte('Armes', 'Projecteur', 'cartesValidAccuJ');
creationCarte('Armes', 'Pointes', 'cartesValidAccuJ');

// Pop up reponse hypotheses joueur
ajoutCarteRepHypoJ('J1', 'Armes', 'Pointes', 'cartesRepHypoJ');
ajoutCarteRepHypoJ('J2', 'Armes', 'Projecteur', 'cartesRepHypoJ');
ajoutCarteRepHypoJ('J3', 'Armes', 'Pointes', 'cartesRepHypoJ');

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