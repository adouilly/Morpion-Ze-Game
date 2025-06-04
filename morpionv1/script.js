// JavaScript pour le morpion Flexbox

// Variables globales
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

// Combinaisons gagnantes
const winningConditions = [
    [0, 1, 2], // Ligne 1
    [3, 4, 5], // Ligne 2
    [6, 7, 8], // Ligne 3
    [0, 3, 6], // Colonne 1
    [1, 4, 7], // Colonne 2
    [2, 5, 8], // Colonne 3
    [0, 4, 8], // Diagonale 1
    [2, 4, 6]  // Diagonale 2
];

// Initialisation du jeu
function initializeGame() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    updateGameStatus();
}

// Gestion du clic sur une case
function handleCellClick(event) {
    const clickedCell = event.target; 
       const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Vérifier si la case est déjà remplie ou si le jeu est fini
    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Marquer la case
    gameBoard[clickedCellIndex] = currentPlayer;
    // Affichage émoticon
    clickedCell.textContent = currentPlayer === 'X' ? '☀️' : '🌙';
    clickedCell.classList.add(currentPlayer.toLowerCase());

    // Vérifier le résultat
    checkResult();
}

// Vérification du résultat
function checkResult() {
    let roundWon = false;

    // Vérifier toutes les combinaisons gagnantes
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        // Victoire
        document.getElementById('game-status').innerHTML = 
            `<span class="winner">🎉 Joueur ${currentPlayer} a gagné!</span>`;
        gameActive = false;
        return;
    }

    // Vérifier le match nul
    if (!gameBoard.includes('')) {
        document.getElementById('game-status').innerHTML = 
            '<span class="winner">🤝 Match nul!</span>';
        gameActive = false;
        return;
    }

    // Changer de joueur
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateGameStatus();
}

// Mise à jour de l'affichage du joueur actuel
function updateGameStatus() {
    const playerTurnElement = document.getElementById('player-turn');
    playerTurnElement.textContent = currentPlayer;
    playerTurnElement.style.color = currentPlayer === 'X' ? '#e74c3c' : '#3498db';
}

// Réinitialiser le jeu
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;

    document.getElementById('game-status').textContent = '';
    
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
        cell.style.background = 'white';
    });

    updateGameStatus();
}

// Initialiser le jeu au chargement de la page
document.addEventListener('DOMContentLoaded', initializeGame);