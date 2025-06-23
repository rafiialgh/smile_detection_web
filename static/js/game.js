let score = 0;
let timeLeft = 15;
let gameInterval;
let spawnInterval;
let gameRunning = false;
let playerName = '';
let scores = [];

// Touch/Swipe variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentTrail = [];

const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('final-score');
const finalPlayerNameEl = document.getElementById('final-player-name');
const gameArea = document.getElementById('kuman-area');
const gameOverEl = document.getElementById('game-over');
const startButton = document.getElementById('start-button');
const startModal = document.getElementById('start-modal')
const scoreboardButton = document.getElementById('scoreboard-button');
const resetButton = document.getElementById('reset-button');
const loadingEl = document.getElementById('loading');

// Modal elements
const nameModal = document.getElementById('name-modal');
const nameInput = document.getElementById('player-name');
const nameSubmit = document.getElementById('submit-name');

// Scoreboard elements
const scoreboardModal = document.getElementById('scoreboard-modal');
const scoreboardList = document.getElementById('scoreboard-list');
const newGameBtn = document.getElementById('new-game-btn');
const closeScoreboardBtn = document.getElementById('close-scoreboard-btn');
const viewScoreboardBtn = document.getElementById('view-scoreboard-btn');

// Initialize touch events for game area
function initTouchEvents() {
  gameArea.addEventListener('touchstart', handleTouchStart, { passive: false });
  gameArea.addEventListener('touchmove', handleTouchMove, { passive: false });
  gameArea.addEventListener('touchend', handleTouchEnd, { passive: false });

  // Also add mouse events for desktop testing
  gameArea.addEventListener('mousedown', handleMouseDown);
  gameArea.addEventListener('mousemove', handleMouseMove);
  gameArea.addEventListener('mouseup', handleMouseEnd);
  gameArea.addEventListener('mouseleave', handleMouseEnd);
}

function handleTouchStart(e) {
  if (!gameRunning) return;
  e.preventDefault();

  const touch = e.touches[0];
  const rect = gameArea.getBoundingClientRect();
  lastX = touch.clientX - rect.left;
  lastY = touch.clientY - rect.top;
  isDrawing = true;
  currentTrail = [];
}

function handleTouchMove(e) {
  if (!gameRunning || !isDrawing) return;
  e.preventDefault();

  const touch = e.touches[0];
  const rect = gameArea.getBoundingClientRect();
  const currentX = touch.clientX - rect.left;
  const currentY = touch.clientY - rect.top;

  // Create trail effect
  createTrail(currentX, currentY);

  // Check for collisions with germs
  checkGermCollision(currentX, currentY);

  lastX = currentX;
  lastY = currentY;
}

function handleTouchEnd(e) {
  if (!gameRunning) return;
  e.preventDefault();
  isDrawing = false;
  currentTrail = [];
}

// Mouse events for desktop
function handleMouseDown(e) {
  if (!gameRunning) return;
  e.preventDefault();

  const rect = gameArea.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
  isDrawing = true;
  currentTrail = [];
}

function handleMouseMove(e) {
  if (!gameRunning || !isDrawing) return;
  e.preventDefault();

  const rect = gameArea.getBoundingClientRect();
  const currentX = e.clientX - rect.left;
  const currentY = e.clientY - rect.top;

  // Create trail effect
  createTrail(currentX, currentY);

  // Check for collisions with germs
  checkGermCollision(currentX, currentY);

  lastX = currentX;
  lastY = currentY;
}

function handleMouseEnd(e) {
  if (!gameRunning) return;
  isDrawing = false;
  currentTrail = [];
}

function createTrail(x, y) {
  const trail = document.createElement('div');
  trail.className = 'swipe-trail';
  trail.style.left = x + 'px';
  trail.style.top = y + 'px';
  gameArea.appendChild(trail);

  // Remove trail after animation
  setTimeout(() => {
    if (trail.parentElement) {
      trail.remove();
    }
  }, 500);
}

function checkGermCollision(x, y) {
  const germs = document.querySelectorAll('.kuman:not(.swiped)');

  germs.forEach((germ) => {
    const germRect = germ.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();

    const germX = germRect.left - gameAreaRect.left + germRect.width / 2;
    const germY = germRect.top - gameAreaRect.top + germRect.height / 2;

    const distance = Math.sqrt(Math.pow(x - germX, 2) + Math.pow(y - germY, 2));

    if (distance < 30) {
      // Collision threshold
      destroyGerm(germ);
    }
  });
}

function destroyGerm(germ) {
  if (germ.classList.contains('swiped')) return;

  germ.classList.add('swiped');
  score++;
  scoreEl.textContent = score;

  // Create explosion effect
  const explosion = document.createElement('div');
  explosion.innerHTML = '💥';
  explosion.style.position = 'absolute';
  explosion.style.left = germ.style.left;
  explosion.style.top = germ.style.top;
  explosion.style.fontSize = '30px';
  explosion.style.pointerEvents = 'none';
  explosion.style.zIndex = '1000';
  explosion.style.animation = 'swipeEffect 0.5s ease-out forwards';
  gameArea.appendChild(explosion);

  // Remove germ and explosion
  setTimeout(() => {
    if (germ.parentElement) germ.remove();
    if (explosion.parentElement) explosion.remove();
  }, 300);
}

// Event listeners
startButton.onclick = () => {
  playerName = '';
  nameInput.value = '';
  nameModal.classList.remove('hidden');
  startModal.classList.add('hidden')
  nameModal.style.display = 'flex';
  nameInput.focus();
};

scoreboardButton.onclick = showScoreboard;

nameSubmit.onclick = () => {
  const nameValue = nameInput.value.trim();
  if (nameValue !== '') {
    playerName = nameValue;
    nameModal.classList.add('hidden');
    nameModal.style.display = 'none';
    startGame();
  } else {
    alert('Please enter your name.');
  }
};

nameInput.onkeypress = (e) => {
  if (e.key === 'Enter') {
    nameSubmit.click();
  }
};

resetButton.onclick = () => {
  gameOverEl.classList.add('hidden');
  playerName = '';
  nameInput.value = '';
  nameModal.classList.remove('hidden');
  nameModal.style.display = 'flex';
  nameInput.focus();
};

viewScoreboardBtn.onclick = () => {
  gameOverEl.classList.add('hidden');
  showScoreboard();
};

newGameBtn.onclick = () => {
  scoreboardModal.classList.add('hidden');
  scoreboardModal.style.display = 'none';
  playerName = '';
  nameInput.value = '';
  nameModal.classList.remove('hidden');
  nameModal.style.display = 'flex';
  nameInput.focus();
};

closeScoreboardBtn.onclick = () => {
  startModal.classList.remove('hidden')
  scoreboardModal.classList.add('hidden');
  scoreboardModal.style.display = 'none';
};

function startGame() {
  if (gameRunning) return;

  loadingEl.classList.remove('hidden');
  startButton.style.display = 'none';

  setTimeout(() => {
    loadingEl.classList.add('hidden');

    gameRunning = true;
    score = 0;
    timeLeft = 15;
    scoreEl.textContent = score;
    timerEl.textContent = timeLeft;
    gameOverEl.classList.add('hidden');

    gameInterval = setInterval(updateTimer, 1000);
    spawnInterval = setInterval(spawnKuman, 1000);
  }, 1000);
}

function updateTimer() {
  if (timeLeft <= 0) {
    endGame();
    return;
  }
  timerEl.textContent = timeLeft;
  timeLeft--;
}

function spawnKuman() {
  const kuman = document.createElement('div');
  kuman.classList.add('kuman');
  kuman.innerHTML = '🦠';
  kuman.style.fontSize = '40px';
  kuman.style.position = 'absolute';

  const maxX = gameArea.clientWidth - 50;
  const maxY = gameArea.clientHeight - 50;

  // Set posisi awal
  let posX = Math.random() * maxX;
  let posY = Math.random() * maxY;
  kuman.style.left = `${posX}px`;
  kuman.style.top = `${posY}px`;

  gameArea.appendChild(kuman);

  // Gerak 
  const velocity = {
    x: (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 2), // kecepatan acak -/+ (1 sampai 3)
    y: (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 2)
  };

  const moveInterval = setInterval(() => {
    posX += velocity.x;
    posY += velocity.y;

    // Bounce jika menyentuh tepi
    if (posX <= 0 || posX >= maxX) velocity.x *= -1;
    if (posY <= 0 || posY >= maxY) velocity.y *= -1;

    kuman.style.left = `${posX}px`;
    kuman.style.top = `${posY}px`;
  }, 20); // pergerakan setiap 20ms

  // Hapus kuman dan interval setelah 4 detik
  setTimeout(() => {
    clearInterval(moveInterval);
    if (
      kuman.parentElement === gameArea &&
      !kuman.classList.contains('swiped')
    ) {
      kuman.remove();
    }
  }, 4000);
}


function endGame() {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  gameRunning = false;
  isDrawing = false;

  // Show start button again
  startButton.style.display = 'block';

  // Save score
  saveScore(playerName, score);

  // Show game over screen
  finalScoreEl.textContent = score;
  finalPlayerNameEl.textContent = playerName;
  gameOverEl.classList.remove('hidden');

  // Clear remaining germs and trails
  document.querySelectorAll('.kuman').forEach((kuman) => kuman.remove());
  document.querySelectorAll('.swipe-trail').forEach((trail) => trail.remove());
}

function saveScore(name, score) {
  const newScore = {
    name: name,
    score: score,
    date: new Date().toLocaleDateString(),
  };

  scores.push(newScore);
  scores.sort((a, b) => b.score - a.score); // Sort by score descending
  scores = scores.slice(0, 10); // Keep only top 10
}

function showScoreboard() {
  scoreboardList.innerHTML = '';

  if (scores.length === 0) {
    scoreboardList.innerHTML =
      '<li style="text-align: center; padding: 2rem; color: #666;">No scores yet!</li>';
  } else {
    scores.forEach((score, index) => {
      const li = document.createElement('li');
      li.className = 'scoreboard-item';
      li.innerHTML = `
        <span class="scoreboard-rank">#${index + 1}</span>
        <span class="scoreboard-name">${score.name}</span>
        <span class="scoreboard-score">${score.score}</span>
      `;
      scoreboardList.appendChild(li);
    });
  }

  scoreboardModal.classList.remove('hidden');
  scoreboardModal.style.display = 'flex';
}

function resetGame() {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  gameRunning = false;
  isDrawing = false;

  score = 0;
  timeLeft = 15;
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;
  finalScoreEl.textContent = '';
  gameOverEl.classList.add('hidden');

  // Show start button
  startButton.style.display = 'block';

  // Clear all remaining germs and trails
  document.querySelectorAll('.kuman').forEach((kuman) => kuman.remove());
  document.querySelectorAll('.swipe-trail').forEach((trail) => trail.remove());
}

// Initialize touch events when page loads
document.addEventListener('DOMContentLoaded', function () {
  initTouchEvents();
});
