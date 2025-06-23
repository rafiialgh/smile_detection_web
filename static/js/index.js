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

  let countdown = 3;
  dot.innerText = countdown;
  modalCountdown.classList.remove('hidden');
  buttonCapture.disabled = true;

  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      dot.innerText = countdown;
    } else {
      clearInterval(countdownInterval);
      modalCountdown.classList.add('hidden');
      buttonCapture.disabled = false;
      dot.innerText = '';
      dot.classList.toggle('bg-white');
      dot.classList.toggle('bg-gray-200');

      // Ambil gambar dari canvas
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL('image/png');

      // Kirim ke /analyze
      fetch('/analyze', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image: dataURL })
      })
      .then((res) => res.json())
      .then((data) => {
        console.log("Analyze Success", data);
        if (data.score !== undefined) {
          showScoreModal(data.smile, data.score); // Tampilkan modal hasil skor

          // Konversi DataURL ke Blob
          const byteString = atob(dataURL.split(',')[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: 'image/png' });

          // Kirim ke /save-image
          const formData = new FormData();
          formData.append("image", blob, "captured-image " + Math.random() + ".jpg");

          return fetch('/save-image', {
            method: "POST",
            body: formData
          });
        }
      })
      .then(res => res ? res.json() : null)
      .then(saveResult => {
        if (saveResult && saveResult.success) {
          console.log("Gambar berhasil disimpan!");
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