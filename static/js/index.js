function toggleDot() {
  const dot = document.getElementById('innerDot');
  dot.classList.toggle('bg-white');
  dot.classList.toggle('bg-gray-200');
}

const video = document.getElementById("webcam");

async function setupCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log(stream)
    video.srcObject = stream;
  } catch (err) {
    console.error("Tidak dapat mengakses kamera:", err);
  }
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