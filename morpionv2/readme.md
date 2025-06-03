// Déroulé partie //
Etape 1 : Deux joueurs / Choix de nom de joueur ( Joueur 1 (impair) / Joueur 2(pair) ).
Etape 2 : Déclenchement partie, Bouton commencer.
Etape 3 : Choix du joueur qui démarre (aléatoire). Joueur 1 démarre avec les formes rondes.
Etape 4 : Joueur qui commence : Appliquer la premiere forme sur la case.
Etape 5 : Coup du joueur suivant.
Etape 6,7,8 : Chaque joueur joue chacun son tour, jusqu'a ce que l'un des joueurs ai une suite de 3 formes qui se suivent.
Etape ... : Victoire d'un des joueurs. Message victoire.
Etape ... : Partie suivante (score mis a jou a chaque fin de partie, max 2 victoires) ou Reset partie.

// Design // 
Header : Avatar j1 et j2 + Noms joueur (Position : gauche et droite) + score (Position : au centre) + Bouton démarrer (début de partie) ou Bouton Reset (fin de partie) Position : En dessous du score.
Body : Plateau de jeu. 9 Cases.
Feature :
1/ Chrono 10 secondes pour jouer un coup se déclenche au changement de joueurs.
2/ Animation sur l'alignement des formes en cas de victoire.
3/ Message victoire.


// Technique //
1/ Enregistrer le nom des deux joueurs. 
2/ Systeme tour par tour.
3/ Bouton déclenchement partie.
4/ Ajout de formes.
5/ Gérer la condition de victoire.
6/ Partie suivante ou reset.

//
// Construction du projet MorpionZeGame
//
// 1. Architecture JS découpée en étapes :
//    - Saisie des pseudos (étape 1)
//    - Choix du nombre de manches (étape 2)
//    - Plateau de jeu dynamique (étape 3)
// 2. Utilisation de variables, constantes, tableaux, objets, fonctions, boucles, conditions, manipulation DOM.
// 3. Rendu dynamique de l'interface via JS natif (aucune surcouche).
