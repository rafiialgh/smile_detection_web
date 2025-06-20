function toggleDot() {
  const dot = document.getElementById('innerDot');
  dot.classList.toggle('bg-white');
  dot.classList.toggle('bg-gray-200');
}

const video = document.getElementById("webcam");
const canvas = document.getElementById("canvas")

// async function setupCamera() {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     console.log(stream)
//     video.srcObject = stream;
//   } catch (err) {
//     console.error("Tidak dapat mengakses kamera:", err);
//   }
// }

function captureImage() {
  const dot = document.getElementById('innerDot');
  dot.classList.toggle('bg-white');
  dot.classList.toggle('bg-gray-200');
  const context = canvas.getContext('2d')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  context.drawImage(video, 0, 0, canvas.width, canvas.height)
  const dataURL = canvas.toDataURL('image/png')

  fetch('/upload', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ image: dataURL })
  }).then((res) => res.json()).then((data) => console.log("Success", data)).catch((error) => console.error("Error", error))
}

document.addEventListener("DOMContentLoaded", setupCamera);

function lodingProgress() {
  let progress = 0
  const loading = document.getElementById('loading')
  const progressBar = document.getElementById('progress-bar')

  const interval = setInterval(() => {
    progress += 1
    progressBar.style.width = `${progress}`

    if (progress >= 100) {
      clearInterval(interval)
      loading.classLis.add('hidden')
    }
  }, 30)
}

function showScoreModal(score) {
    const modal = document.getElementById('scoreModal');
    const scoreText = document.getElementById('scoreValue');

    scoreText.textContent = `${score}%`;
    modal.classList.remove('hidden');
  }

  function closeScoreModal() {
    const modal = document.getElementById('scoreModal');
    modal.classList.add('hidden');
  }