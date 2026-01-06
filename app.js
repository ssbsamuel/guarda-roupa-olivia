import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

/* 🔥 FIREBASE CONFIG (CORRIGIDO) */
const firebaseConfig = {
  apiKey: "AIzaSyDSk5DdL6zAkl9VO9IcNtMjXXNzkhBaZGk",
  authDomain: "guarda-roupa-olivia.firebaseapp.com",
  projectId: "guarda-roupa-olivia",
  storageBucket: "guarda-roupa-olivia.appspot.com",
  messagingSenderId: "729428309934",
  appId: "1:729428309934:web:fdc7d7bda0299143813a3f"
};

const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);

/* 🔐 EMAILS AUTORIZADOS */
const emailsPermitidos = [
  "ssbsamuel1007@gmail.com",
  "anajulia15ass@gmail.com"
];

/* 📂 CATEGORIAS */
const categorias = [
  "Todos","Laços","Body","Calça/Short","Macacão","Jardineira","Vestido",
  "Conjunto","Meia/Luva","Sapato","Cueiro","Cobertor","Lençol",
  "Toalha de Banho","Pano de Boca","Kit Higiene","Fraldas"
];

/* 🔐 LOGIN */
const login = document.getElementById("login");
const appDiv = document.getElementById("app");

onAuthStateChanged(auth, user => {
  if (user && emailsPermitidos.includes(user.email)) {
    login.style.display = "none";
    appDiv.style.display = "block";
  } else if (user) {
    alert("Acesso não autorizado");
    auth.signOut();
  }
});

document.getElementById("btnGoogle").onclick = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

/* 🔘 FILTROS */
const filtrosDiv = document.getElementById("filtros");
let filtroAtivo = "Todos";

categorias.forEach(cat => {
  const btn = document.createElement("button");
  btn.textContent = cat;
  btn.className = "filtro-btn";
  if (cat === filtroAtivo) btn.classList.add("ativo");

  btn.onclick = () => {
    filtroAtivo = cat;
    atualizarBotoes();
  };

  filtrosDiv.appendChild(btn);
});

function atualizarBotoes() {
  document.querySelectorAll(".filtro-btn").forEach(b => {
    b.classList.toggle("ativo", b.textContent === filtroAtivo);
  });
}

/* 🔄 ROUPAS */
const lista = document.getElementById("lista");
const roupasCol = collection(db, "roupas");

onSnapshot(roupasCol, snap => {
  lista.innerHTML = "";
  snap.forEach(doc => {
    const r = doc.data();
    if (filtroAtivo === "Todos" || r.tipo === filtroAtivo) {
      lista.innerHTML += `
        <div class="card">
          <img src="${r.img}">
          <b>${r.tipo}</b><br>
          Tam: ${r.tamanho}<br>
          Qtd: ${r.quantidade}
        </div>
      `;
    }
  });
});

/* ➕ MODAL */
const modal = document.getElementById("modal");
document.getElementById("btnAdd").onclick = () => modal.style.display = "flex";
document.getElementById("cancelar").onclick = () => modal.style.display = "none";

/* 💾 SALVAR */
document.getElementById("salvar").onclick = async () => {
  const foto = document.getElementById("foto").files[0];
  const tipo = document.getElementById("tipo").value;
  const tamanho = document.getElementById("tamanho").value;
  const quantidade = document.getElementById("quantidade").value;

  if (!foto || !tipo || !tamanho || !quantidade) {
    alert("Preencha tudo");
    return;
  }

  const imgRef = ref(storage, "roupas/" + Date.now() + foto.name);
  await uploadBytes(imgRef, foto);
  const url = await getDownloadURL(imgRef);

  await addDoc(roupasCol, { img: url, tipo, tamanho, quantidade });
  modal.style.display = "none";
};
