// Variables globales
let players = [
  { pseudo: '', img: 'asset/img-j1.png', score: 0 }, // Joueur 1
  { pseudo: '', img: 'asset/img-j2.png', score: 0 }  // Joueur 2
];
let currentStep = 1; // Etape courante du jeu (1: pseudos, 2: manches, 3: plateau)
let roundsToWin = 1; // Nombre de manches à gagner
let currentBoard = []; // Plateau de jeu (tableau 3x3)
let currentPlayerIndex = 0; // Index du joueur courant (0 ou 1)
let gameState = 'init'; // Etat du jeu ('init', 'waiting', 'playing')
let lastAnimatedCell = null; // Pour animer uniquement la dernière case jouée

// Couleurs néon pour les formes, choisies aléatoirement à chaque partie
let shapeColors = [
  { o: '#00fff7', x: '#ff00ea' },
  { o: '#00ff00', x: '#ffea00' },
  { o: '#00c3ff', x: '#ff5e00' },
  { o: '#00ffb7', x: '#ff007a' }
];
let currentShapeColors = shapeColors[0];

// Fonction utilitaire pour choisir une palette de couleurs aléatoire pour les formes
function pickRandomShapeColors() {
  currentShapeColors = shapeColors[Math.floor(Math.random() * shapeColors.length)];
}

// Fonction d'initialisation appelée au chargement de la page
function init() {
  currentStep = 1;
  players[0].pseudo = '';
  players[1].pseudo = '';
  players[0].score = 0;
  players[1].score = 0;
  roundsToWin = 1;
  renderStep();
}

// Fonction qui gère le rendu dynamique de chaque étape du jeu
function renderStep() {
  const app = document.getElementById('app');
  if (currentStep === 1) {
    // Saisie des pseudos
    app.innerHTML = `
      <section class="step step-pseudo">
        <h1>MorpionZeGame</h1>
        <form id="pseudo-form">
          <div class="player-input">
            <img src="asset/img-j1.png" alt="Joueur 1" class="avatar" />
            <input type="text" id="pseudo-j1" placeholder="Pseudo Joueur 1" maxlength="12" required />
          </div>
          <div class="player-input">
            <img src="asset/img-j2.png" alt="Joueur 2" class="avatar" />
            <input type="text" id="pseudo-j2" placeholder="Pseudo Joueur 2" maxlength="12" required />
          </div>
          <button type="submit">Valider</button>
        </form>
      </section>
    `;
    document.getElementById('pseudo-form').onsubmit = handlePseudoSubmit;
  } else if (currentStep === 2) {
    // Choix du nombre de manches
    app.innerHTML = `
      <section class="step step-rounds">
        <h2>Nombre de manches à gagner</h2>
        <form id="rounds-form">
          <label>
            <input type="radio" name="rounds" value="1" checked /> 1 manche
          </label>
          <label>
            <input type="radio" name="rounds" value="3" /> 3 manches
          </label>
          <button type="submit">Valider</button>
        </form>
      </section>
    `;
    document.getElementById('rounds-form').onsubmit = handleRoundsSubmit;
  } else if (currentStep === 3) {
    // Plateau de jeu et interface principale
    currentBoard = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
    gameState = 'waiting';
    app.innerHTML = `
      <section class="step step-game">
        <div class="players-info">
          <div class="player player-left">
            <img src="${players[0].img}" alt="Joueur 1" class="avatar" />
            <div class="pseudo">${players[0].pseudo}</div>
            <div class="score">Score : <span id="score-j1">${players[0].score}</span></div>
          </div>
          <div class="scoreboard">
            <button id="reset-btn">Reset</button>
            <div class="rounds">Manches à gagner : ${roundsToWin}</div>
          </div>
          <div class="player player-right">
            <img src="${players[1].img}" alt="Joueur 2" class="avatar" />
            <div class="pseudo">${players[1].pseudo}</div>
            <div class="score">Score : <span id="score-j2">${players[1].score}</span></div>
          </div>
        </div>
        <div class="game-board-container">
          <button id="start-btn">Commencer</button>
          <div id="game-board" class="game-board"></div>
        </div>
        <div id="popup" class="popup" style="display:none;"></div>
      </section>
    `;
    document.getElementById('reset-btn').onclick = resetGame;
    document.getElementById('start-btn').onclick = startGame;
    renderBoard();
  }
  // ...autres étapes à venir...
}

function handlePseudoSubmit(e) {
  e.preventDefault();
  const pseudo1 = document.getElementById('pseudo-j1').value.trim();
  const pseudo2 = document.getElementById('pseudo-j2').value.trim();
  if (!pseudo1 || !pseudo2 || pseudo1 === pseudo2) {
    alert('Veuillez entrer deux pseudos différents.');
    return;
  }
  players[0].pseudo = pseudo1;
  players[1].pseudo = pseudo2;
  currentStep = 2;
  renderStep();
}

function handleRoundsSubmit(e) {
  e.preventDefault();
  const rounds = document.querySelector('input[name="rounds"]:checked').value;
  roundsToWin = parseInt(rounds, 10);
  currentStep = 3;
  renderStep();
}

function renderBoard() {
  const board = document.getElementById('game-board');
  if (!board) return;
  let html = '<table><tbody>';
  for (let i = 0; i < 3; i++) {
    html += '<tr>';
    for (let j = 0; j < 3; j++) {
      const val = currentBoard[i][j];
      const cellId = `cell-${i}-${j}`;
      // Ajout d'une classe 'animated' uniquement pour la dernière case jouée
      const animated = lastAnimatedCell && lastAnimatedCell.id === cellId;
      html += `<td class="cell" data-row="${i}" data-col="${j}" id="${cellId}">${renderShape(val, cellId, animated)}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  board.innerHTML = html;
  // Ajout des listeners si la partie est en cours
  if (gameState === 'playing') {
    const cells = board.querySelectorAll('.cell');
    cells.forEach(cell => cell.onclick = handleCellClick);
  }
  // Animation de la dernière case jouée uniquement
  if (lastAnimatedCell) {
    animateShape(lastAnimatedCell.id, lastAnimatedCell.val);
    lastAnimatedCell = null;
  }
}

function renderShape(val, cellId, animated) {
  if (val === 'O') {
    // Si la case vient d'être jouée, on anime, sinon on affiche le cercle complet
    if (animated) {
      return `<svg width="70" height="70" viewBox="0 0 70 70" style="display:block;margin:auto;">
        <circle id="circle-${cellId}" cx="35" cy="35" r="22" stroke="${currentShapeColors.o}" stroke-width="5" fill="none" stroke-dasharray="138" stroke-dashoffset="138" />
      </svg>`;
    } else {
      return `<svg width="70" height="70" viewBox="0 0 70 70" style="display:block;margin:auto;">
        <circle cx="35" cy="35" r="22" stroke="${currentShapeColors.o}" stroke-width="5" fill="none" stroke-dasharray="138" stroke-dashoffset="0" />
      </svg>`;
    }
  }
  if (val === 'X') {
    if (animated) {
      return `<svg width="70" height="70" viewBox="0 0 70 70" style="display:block;margin:auto;">
        <line id="x1-${cellId}" x1="20" y1="20" x2="20" y2="20" stroke="${currentShapeColors.x}" stroke-width="5" stroke-linecap="round" />
        <line id="x2-${cellId}" x1="50" y1="20" x2="50" y2="20" stroke="${currentShapeColors.x}" stroke-width="5" stroke-linecap="round" />
      </svg>`;
    } else {
      return `<svg width="70" height="70" viewBox="0 0 70 70" style="display:block;margin:auto;">
        <line x1="20" y1="20" x2="50" y2="50" stroke="${currentShapeColors.x}" stroke-width="5" stroke-linecap="round" />
        <line x1="50" y1="20" x2="20" y2="50" stroke="${currentShapeColors.x}" stroke-width="5" stroke-linecap="round" />
      </svg>`;
    }
  }
  return '';
}

function injectNeonFilters() {
  let svg = document.getElementById('neon-filters');
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.id = 'neon-filters';
    document.body.appendChild(svg);
  }
  svg.innerHTML = `
    <filter id="neonO">
      <feDropShadow dx="0" dy="0" stdDeviation="0.5" flood-color="${currentShapeColors.o}"/>
      <feDropShadow dx="0" dy="0" stdDeviation="2.5" flood-color="${currentShapeColors.o}"/>
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="${currentShapeColors.o}"/>
    </filter>
    <filter id="neonX">
      <feDropShadow dx="0" dy="0" stdDeviation="0.5" flood-color="${currentShapeColors.x}"/>
      <feDropShadow dx="0" dy="0" stdDeviation="2.5" flood-color="${currentShapeColors.x}"/>
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="${currentShapeColors.x}"/>
    </filter>
  `;
}

function startGame() {
  // Détermine aléatoirement qui commence
  currentPlayerIndex = Math.floor(Math.random() * 2);
  pickRandomShapeColors();
  injectNeonFilters();
  gameState = 'playing';
  document.getElementById('start-btn').style.display = 'none';
  renderBoard();
  showCurrentPlayer();
}

function showCurrentPlayer() {
  // Affiche visuellement le joueur courant (ex: highlight)
  document.querySelectorAll('.player').forEach((el, idx) => {
    el.classList.toggle('active', idx === currentPlayerIndex);
  });
}

function handleCellClick(e) {
  if (gameState !== 'playing') return;
  const row = parseInt(e.target.dataset.row, 10);
  const col = parseInt(e.target.dataset.col, 10);
  if (currentBoard[row][col] !== '') return;
  // Premier joueur = O, second = X
  currentBoard[row][col] = currentPlayerIndex === 0 ? 'O' : 'X';
  lastAnimatedCell = { id: `cell-${row}-${col}`, val: currentBoard[row][col] };
  renderBoard();
  if (checkWin()) {
    players[currentPlayerIndex].score++;
    updateScores();
    showPopup(`${players[currentPlayerIndex].pseudo} a gagné la manche !`);
    if (players[currentPlayerIndex].score >= roundsToWin) {
      setTimeout(() => showPopup(`${players[currentPlayerIndex].pseudo} remporte la partie !`, true), 3000);
    } else {
      setTimeout(nextRound, 3000);
    }
    gameState = 'waiting';
    return;
  }
  if (isBoardFull()) {
    showPopup('Égalité !');
    setTimeout(nextRound, 3000);
    gameState = 'waiting';
    return;
  }
  // Changement de joueur
  currentPlayerIndex = 1 - currentPlayerIndex;
  showCurrentPlayer();
}

function checkWin() {
  const b = currentBoard;
  for (let i = 0; i < 3; i++) {
    if (b[i][0] && b[i][0] === b[i][1] && b[i][1] === b[i][2]) return true;
    if (b[0][i] && b[0][i] === b[1][i] && b[1][i] === b[2][i]) return true;
  }
  if (b[0][0] && b[0][0] === b[1][1] && b[1][1] === b[2][2]) return true;
  if (b[0][2] && b[0][2] === b[1][1] && b[1][1] === b[2][0]) return true;
  return false;
}

function isBoardFull() {
  return currentBoard.flat().every(cell => cell !== '');
}

function updateScores() {
  document.getElementById('score-j1').textContent = players[0].score;
  document.getElementById('score-j2').textContent = players[1].score;
}

function showPopup(message, end = false) {
  const popup = document.getElementById('popup');
  popup.textContent = message;
  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.display = 'none';
    if (end) {
      currentStep = 1;
      renderStep();
    }
  }, 3000);
}

function nextRound() {
  currentBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  gameState = 'playing';
  pickRandomShapeColors();
  injectNeonFilters();
  document.getElementById('start-btn').style.display = 'none';
  renderBoard();
  showCurrentPlayer();
}

function resetGame() {
  currentStep = 1;
  players[0].score = 0;
  players[1].score = 0;
  renderStep();
}

function animateShape(cellId, val) {
  if (val === 'O') {
    // Animation cercle : stroke-dashoffset de 138 à 0
    const circle = document.getElementById(`circle-${cellId}`);
    if (!circle) return;
    let progress = 0;
    function animate() {
      progress += 1/60;
      const offset = Math.max(0, 138 * (1 - progress));
      circle.setAttribute('stroke-dashoffset', offset);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        circle.setAttribute('stroke-dashoffset', 0);
      }
    }
    animate();
  } else if (val === 'X') {
    // Animation croix : x2 et y2 de chaque ligne de 20->50
    const l1 = document.getElementById(`x1-${cellId}`);
    const l2 = document.getElementById(`x2-${cellId}`);
    if (!l1 || !l2) return;
    let progress = 0;
    function animate() {
      progress += 1/60;
      const v = 20 + (50 - 20) * Math.min(progress, 1);
      l1.setAttribute('x2', v);
      l1.setAttribute('y2', v);
      l2.setAttribute('x2', 20 + (50 - 20) * (1 - Math.min(progress, 1)));
      l2.setAttribute('y2', 50 - (50 - 20) * (1 - Math.min(progress, 1)));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        l1.setAttribute('x2', 50);
        l1.setAttribute('y2', 50);
        l2.setAttribute('x2', 20);
        l2.setAttribute('y2', 50);
      }
    }
    animate();
  }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', init);
//# sourceMappingURL=app.js.map