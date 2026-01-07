import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSk5DdL6zAkl9VO9IcNtMjXXNzkhBaZGk",
  authDomain: "guarda-roupa-olivia.firebaseapp.com",
  projectId: "guarda-roupa-olivia",
  storageBucket: "guarda-roupa-olivia.appspot.com",
  messagingSenderId: "729428309934",
  appId: "1:729428309934:web:fdc7d7bda0299143813a3f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const categorias = [
  "Todos","Laços","Body","Calça/Short","Macacão","Jardineira",
  "Vestido","Conjunto","Meia/Luva","Sapato","Cueiro","Cobertor",
  "Lençol","Toalha de Banho","Pano de Boca","Kit Higiene","Fraldas"
];

const filtros = document.getElementById("filtros");
const lista = document.getElementById("listaRoupas");
const modal = document.getElementById("modal");

categorias.forEach(c => {
  const btn = document.createElement("button");
  btn.textContent = c;
  if (c === "Todos") btn.classList.add("ativo");
  btn.onclick = () => filtrar(c);
  filtros.appendChild(btn);

  if (c !== "Todos") {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    document.getElementById("tipo").appendChild(opt);
  }
});

document.getElementById("abrirModal").onclick = () => modal.style.display = "flex";
document.getElementById("cancelar").onclick = () => modal.style.display = "none";

document.getElementById("imagem").onchange = () => {
  document.getElementById("msgImagem").textContent = "🔥 Imagem carregada";
};

document.getElementById("salvar").onclick = async () => {
  const file = document.getElementById("imagem").files[0];
  if (!file) return alert("Selecione uma imagem");

  const tipo = document.getElementById("tipo").value;
  const tamanho = document.getElementById("tamanho").value;
  const quantidade = document.getElementById("quantidade").value || 1;

  const imgRef = ref(storage, `roupas/${Date.now()}_${file.name}`);
  await uploadBytes(imgRef, file);
  const url = await getDownloadURL(imgRef);

  await addDoc(collection(db, "roupas"), {
    tipo, tamanho, quantidade, url
  });

  modal.style.display = "none";
};

onSnapshot(collection(db, "roupas"), snap => {
  lista.innerHTML = "";
  snap.forEach(docSnap => {
    const r = docSnap.data();
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${r.url}">
      <p>${r.tipo}</p>
      <p>${r.tamanho || ""} | Qtde: ${r.quantidade}</p>
      <button>Excluir</button>
    `;
    div.querySelector("button").onclick = () =>
      deleteDoc(doc(db, "roupas", docSnap.id));
    lista.appendChild(div);
  });
});

function filtrar(cat) {
  document.querySelectorAll(".filtros button").forEach(b => b.classList.remove("ativo"));
  event.target.classList.add("ativo");
}
