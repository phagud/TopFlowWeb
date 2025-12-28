let stream;
let selectedUserIndex = 0;

const video = document.getElementById('camera-preview');
const overlay = document.getElementById('overlay');
const arrowBtn = document.getElementById('arrow-btn');
const captureBtn = document.getElementById('capture-btn');
const userMenu = document.getElementById('user-menu');
const userListEl = document.getElementById('user-list');

const users = ["Alice", "Bob", "Carol", "Dave"]; // usuários exemplares

// popula a lista de usuários
function populateUsers() {
  userListEl.innerHTML = "";
  users.forEach((u, i) => {
    const li = document.createElement('li');
    li.textContent = u;
    if(i === selectedUserIndex) li.classList.add('selected');
    li.onclick = () => selectUser(i);
    userListEl.appendChild(li);
  });
}

function selectUser(index) {
  selectedUserIndex = index;
  populateUsers();
  hideMenu();
}

function hideMenu() {
  userMenu.classList.add('hidden');
}

function toggleMenu() {
  userMenu.classList.toggle('hidden');
}

// iniciar câmera
async function startCamera() {
  overlay.style.display = 'none';
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;
  } catch (e) {
    alert("Erro ao acessar a câmera: " + e.message);
  }
}

// tirar foto
captureBtn.addEventListener('click', async () => {
  if(!stream) return alert("Ative a câmera primeiro");

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));

  // compartilhar (Web Share API)
  if(navigator.share) {
    const file = new File([blob], "foto.jpg", { type: blob.type });
    navigator.share({ files: [file], text: users[selectedUserIndex] }).catch(console.log);
  } else {
    console.log("Compartilhar não suportado");
  }

  // copiar texto para clipboard
  navigator.clipboard.writeText(users[selectedUserIndex]).catch(console.log);

  // remover usuário da lista
  users.splice(selectedUserIndex, 1);
  if(users.length > 0) selectedUserIndex = users.length - 1;
  else selectedUserIndex = -1;
  populateUsers();
});

arrowBtn.addEventListener('click', toggleMenu);

// inicialização
populateUsers();
