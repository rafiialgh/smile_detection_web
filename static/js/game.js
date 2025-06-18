let score = 0;
let timeLeft = 60;
let gameInterval;
let spawnInterval;
let gameRunning = false;
let playerName = "";

const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("final-score");
const gameArea = document.getElementById("game-area");
const gameOverEl = document.getElementById("game-over");
const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");

// Modal untuk nama pemain
const nameModal = document.getElementById("name-modal");
const nameInput = document.getElementById("player-name");
const nameSubmit = document.getElementById("submit-name");

startButton.onclick = () => {
  if (!playerName) {
    nameModal.classList.remove("hidden");
  } else {
    startGame();
  }
};

nameSubmit.onclick = () => {
  const nameValue = nameInput.value.trim();
  if (nameValue !== "") {
    playerName = nameValue;
    nameModal.classList.add("hidden");
    startGame();
  } else {
    alert("Silakan masukkan nama Anda.");
  }
};

resetButton.onclick = resetGame;

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  timeLeft = 60;
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;
  gameOverEl.classList.add("hidden");

  gameInterval = setInterval(updateTimer, 1000);
  spawnInterval = setInterval(spawnKuman, 800);
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
  const kuman = document.createElement("img");
  kuman.src = "/static/images/kuman.svg";
  kuman.classList.add("kuman");

  kuman.style.left = Math.random() * (gameArea.clientWidth - 50) + "px";
  kuman.style.top = Math.random() * (gameArea.clientHeight - 50) + "px";

  kuman.onclick = () => {
    score++;
    scoreEl.textContent = score;
    kuman.remove();
  };

  gameArea.appendChild(kuman);

  setTimeout(() => {
    if (kuman.parentElement === gameArea) {
      kuman.remove();
    }
  }, 3000);
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  gameRunning = false;
  finalScoreEl.textContent = score;
  gameOverEl.classList.remove("hidden");

  // Kirim nama + skor
  fetch('/submit_score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: playerName, score: score })
  });
}

function resetGame() {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  gameRunning = false;

  score = 0;
  timeLeft = 60;
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;
  finalScoreEl.textContent = "";
  gameOverEl.classList.add("hidden");

  // Hapus semua kuman tersisa
  document.querySelectorAll(".kuman").forEach(kuman => kuman.remove());
}
