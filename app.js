const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const startBtn = document.getElementById("start");
const snapBtn = document.getElementById("snap");
const shareBtn = document.getElementById("share");

let stream;

// Registrar Service Worker (PWA)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

// Abrir câmera SOMENTE quando clicar
startBtn.onclick = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  });
  video.srcObject = stream;
};

// Tirar foto
snapBtn.onclick = () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  canvas.style.display = "block";
  video.style.display = "none";
};

// Compartilhar
shareBtn.onclick = async () => {
  canvas.toBlob(async blob => {
    const file = new File([blob], "foto.jpg", { type: "image/jpeg" });

    if (navigator.share) {
      await navigator.share({
        files: [file],
        text: "Índice: 123\nInfo adicional"
      });
    } else {
      alert("Compartilhamento não suportado");
    }
  }, "image/jpeg", 0.9);
};