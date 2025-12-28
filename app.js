let stream;
let selectedUserIndex = 0;
let menuOpen = false;
let touchStartX = 0;

const video = document.getElementById('camera-preview');
const overlay = document.getElementById('overlay');
const captureBtn = document.getElementById('capture-btn');
const arrowBtn = document.getElementById('arrow-btn');
const userMenu = document.getElementById('user-menu');
const userListEl = document.getElementById('user-list');

const users = ["Alice", "Bob", "Carol", "Dave"]; // usuários exemplares

// Popula a lista de usuários
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

// Seleciona usuário
function selectUser(index) {
  selectedUserIndex = index;
  populateUsers();
  closeMenu();
}

// Abrir/fechar menu lateral
function openMenu() {
  menuOpen = true;
  userMenu.classList.add('visible');
  arrowBtn.textContent = "<";
}

function closeMenu() {
  menuOpen = false;
  userMenu.classList.remove('visible');
  arrowBtn.textContent = ">";
}

function toggleMenu() {
  if(menuOpen) closeMenu();
  else openMenu();
}

// Evento da setinha
arrowBtn.addEventListener('click', toggleMenu);

// Swipe touch para fechar
userMenu.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
});

userMenu.addEventListener('touchmove', e => {
  const touchX = e.touches[0].clientX;
  const deltaX = touchX - touchStartX;
  if(deltaX > 50){ // deslizou para direita
    closeMenu();
  }
});

// Iniciar câmera
async function startCamera() {
  overlay.style.display = 'none';
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;
  } catch (e) {
    alert("Erro ao acessar a câmera: " + e.message);
  }
}

// Tirar foto
captureBtn.addEventListener('click', async () => {
  if(!stream) return alert("Ative a câmera primeiro");

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));

  // Compartilhar (Web Share API)
  if(navigator.share){
    const file = new File([blob], "foto.jpg", { type: blob.type });
    navigator.share({ files: [file], text: users[selectedUserIndex] }).catch(console.log);
  } else {
    console.log("Compartilhar não suportado");
  }

  // Copiar texto para clipboard
  navigator.clipboard.writeText(users[selectedUserIndex]).catch(console.log);

  // Remover usuário da lista
  users.splice(selectedUserIndex, 1);
  if(users.length > 0) selectedUserIndex = users.length - 1;
  else selectedUserIndex = -1;
  populateUsers();
});

// Inicialização
populateUsers();
