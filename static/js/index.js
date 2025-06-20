function toggleDot() {
  const dot = document.getElementById('innerDot');
  dot.classList.toggle('bg-white');
  dot.classList.toggle('bg-gray-200');
}

const video = document.getElementById("webcam");
const canvas = document.getElementById("canvas")

async function setupCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log(stream)
    video.srcObject = stream;
  } catch (err) {
    console.error("Tidak dapat mengakses kamera:", err);
  }
}

function captureImage() {
  const modalCountdown = document.getElementById('modalCountdown')
  const dot = document.getElementById('countdown');
  const buttonCapture = document.getElementById('buttonCapture')
  // dot.classList.toggle('bg-white');
  // dot.classList.toggle('bg-gray-200');

  // Tampilkan countdown selama 3 detik sebelum mengambil gambar
  let countdown = 3;
  // const originalText = dot.innerHTML;
  dot.innerText = countdown;
  modalCountdown.classList.remove('hidden');
  buttonCapture.disabled = true

  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      
      dot.innerText = countdown;
    } else {
      clearInterval(countdownInterval);
      modalCountdown.classList.add('hidden');
      buttonCapture.disabled = false
      dot.innerText = ''; // Bersihkan tampilan countdown
      dot.classList.toggle('bg-white');
      dot.classList.toggle('bg-gray-200');

      // Ambil gambar setelah countdown selesai
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL('image/png');

      // Kirim gambar ke server
      fetch('/analyze', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image: dataURL })
      })
      .then((res) => res.json())
      .then((data) => {
        console.log("Success", data);
        if (data.score !== undefined) {
          showScoreModal(data.smile, data.score); // Tampilkan modal hasil skor
        }
      })
      .catch((error) => console.error("Error", error));
    }
  }, 1000);
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

function showScoreModal(smile, score) {
    const modal = document.getElementById('scoreModal');
    const scoreText = document.getElementById('scoreValue');
    const smileText = document.getElementById('smileValue');


    smileText.textContent = `${smile}`;
    scoreText.textContent = `${score}%`;
    modal.classList.remove('hidden');
  }

  function closeScoreModal() {
    const modal = document.getElementById('scoreModal');
    modal.classList.add('hidden');
  }