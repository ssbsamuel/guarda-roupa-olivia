import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

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
  "Todos","Laços","Body","Calça/Short","Macacão","Jardineira","Vestido",
  "Conjunto","Meia/Luva","Sapato","Cueiro","Cobertor","Lencol",
  "Toalha de Banho","Pano de Boca","Kit Higiene","Fraldas"
];

const filtros = document.getElementById("filtros");
const lista = document.getElementById("lista");
const modal = document.getElementById("modal");

const foto = document.getElementById("foto");
const tipo = document.getElementById("tipo");
const tamanho = document.getElementById("tamanho");
const quantidade = document.getElementById("quantidade");

const msgFoto = document.getElementById("msgFoto");
const msgSucesso = document.getElementById("msgSucesso");

let filtroAtual = "Todos";

// BOTÕES
categorias.forEach(cat => {
  const b = document.createElement("button");
  b.textContent = cat;
  if (cat === "Todos") b.classList.add("active");
  b.onclick = () => {
    filtroAtual = cat;
    document.querySelectorAll("nav button").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    render();
  };
  filtros.appendChild(b);
});

// SELECT
categorias.slice(1).forEach(cat => {
  const o = document.createElement("option");
  o.textContent = cat;
  tipo.appendChild(o);
});

// MODAL
document.getElementById("btnAdd").onclick = () => modal.style.display = "flex";
document.getElementById("cancelar").onclick = () => modal.style.display = "none";

foto.onchange = () => msgFoto.textContent = "📸 Imagem carregada";

// FIRESTORE
const roupasRef = collection(db, "roupas");

onSnapshot(roupasRef, () => render());

async function render() {
  lista.innerHTML = "";
  const snap = await onSnapshot(roupasRef, s => {
    lista.innerHTML = "";
    s.forEach(d => {
      const r = d.data();
      if (filtroAtual !== "Todos" && r.tipo !== filtroAtual) return;

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${r.img}">
        <b>${r.tipo}</b><br>
        ${r.tamanho || ""} | Qtde: ${r.quantidade || 1}
        <button onclick="excluir('${d.id}')">Excluir</button>
      `;
      lista.appendChild(card);
    });
  });
}

window.excluir = async id => {
  if (confirm("Excluir item?")) {
    await deleteDoc(collection(db,"roupas"), id);
  }
};

document.getElementById("salvar").onclick = async () => {
  if (!foto.files.length) return alert("Selecione uma imagem");

  const file = foto.files[0];
  const refImg = ref(storage, "roupas/" + Date.now() + file.name);

  await uploadBytes(refImg, file);
  const url = await getDownloadURL(refImg);

  await addDoc(roupasRef, {
    img: url,
    tipo: tipo.value,
    tamanho: tamanho.value || "",
    quantidade: quantidade.value || 1
  });

  msgSucesso.style.display = "block";
  setTimeout(() => {
    msgSucesso.style.display = "none";
    modal.style.display = "none";
  }, 1200);

  foto.value = "";
  tamanho.value = "";
  quantidade.value = "";
  msgFoto.textContent = "";
};
