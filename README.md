# games

p001 : casse tête réversible (toute action peut être annulée, comme pour le Rubik's cube, pas_comme Sokoban, par exemple)
basé sur un plateau de 3x3 cases, avec 4 carrés sur chaque case.
Une action consiste à choisir une case "c", et alors les cases adjacentes "d" seront modifiées: s'il y a un rectangle qui pointe de "c" vers "d",
alors tous les carrés de "d" sauf celui pointant vers "c" est changé. Un second appui sur "c" restaure l'ancien état des cases "d".
Il y a un peu moins de 2^36 configurations accessibles.
