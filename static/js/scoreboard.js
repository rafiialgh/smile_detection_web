
// const scoreboardList = document.getElementById('scoreboard-list')

// function showScoreboard() {
//   scoreboardList.innerHTML = '';

//   if (scores.length === 0) {
//     scoreboardList.innerHTML =
//       '<li style="text-align: center; padding: 2rem; color: #666;">No scores yet!</li>';
//   } else {
//     scores.forEach((score, index) => {
//       const li = document.createElement('li');
//       li.className = 'scoreboard-item';
//       li.innerHTML = `
//         <span class="scoreboard-rank">#${index + 1}</span>
//         <span class="scoreboard-name">${score.name}</span>
//         <span class="scoreboard-score">${score.score}</span>
//       `;
//       scoreboardList.appendChild(li);
//     });
//   }

//   scoreboardModal.classList.remove('hidden');
//   scoreboardModal.style.display = 'flex';
// }