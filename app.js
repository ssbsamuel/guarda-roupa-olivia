import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

/* 🔥 FIREBASE */
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

/* 📦 ELEMENTOS */
const lista = document.getElementById("lista");
const filtros = document.getElementById("filtros");
const modal = document.getElementById("modal");

const foto = document.getElementById("foto");
const tipo = document.getElementById("tipo");
const tamanho = document.getElementById("tamanho");
const quantidade = document.getElementById("quantidade");

const salvarBtn = document.getElementById("salvar");
const cancelarBtn = document.getElementById("cancelar");
const msgFoto = document.getElementById("msgFoto");
const msgSucesso = document.getElementById("msgSucesso");

/* 🧺 CATEGORIAS */
const categorias = [
  "Todos",
  "Laços",
  "Body",
  "Calça/Short",
  "Macacão",
  "Jardineira",
  "Vestido",
  "Conjunto",
  "Meia/Luva",
  "Sapato",
  "Cueiro",
  "Cobertor",
  "Lencol",
  "Toalha de Banho",
  "Pano de Boca",
  "Kit Higiene",
  "Fraldas"
];

let filtroAtual = "Todos";

/* 🔘 BOTÕES DE FILTRO */
categorias.forEach(cat => {
  const btn = document.createElement("button");
  btn.textContent = cat;
  if (cat === "Todos") btn.classList.add("active");

  btn.onclick = () => {
    filtroAtual = cat;
    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    render();
  };

  filtros.appendChild(btn);
});

/* ⬇️ SELECT */
categorias.slice(1).forEach(cat => {
  const op = document.createElement("option");
  op.value = cat;
  op.textContent = cat;
  tipo.appendChild(op);
});

/* ➕ MODAL */
document.getElementById("btnAdd").onclick = () => {
  modal.style.display = "flex";
};

cancelarBtn.onclick = () => {
  fecharModal();
};

/* 🧼 LIMPAR MODAL */
function fecharModal() {
  modal.style.display = "none";
  foto.value = "";
  tamanho.value = "";
  quantidade.value = "";
  msgFoto.textContent = "";
  msgSucesso.style.display = "none";
}

/* 📁 FIRESTORE */
const roupasRef = collection(db, "roupas");

/* 🔄 LISTAGEM EM TEMPO REAL */
onSnapshot(roupasRef, render);

async function render() {
  lista.innerHTML = "";

  const snap = await new Promise(resolve => {
    onSnapshot(roupasRef, resolve);
  });

  snap.forEach(doc => {
    const r = doc.data();

    if (filtroAtual !== "Todos" && r.tipo !== filtroAtual) return;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${r.img}" />
      <b>${r.tipo}</b><br>
      ${r.tamanho || ""} | Qtde: ${r.quantidade || 1}
      <button onclick="excluir('${doc.id}')">Excluir</button>
    `;

    lista.appendChild(card);
  });
}

/* ❌ EXCLUIR */
window.excluir = async id => {
  if (confirm("Deseja excluir este item?")) {
    await deleteDoc(collection(db, "roupas"), id);
  }
};

/* 💾 SALVAR — AGORA 100% CORRETO */
salvarBtn.onclick = async () => {
  if (!foto.files.length) {
    alert("Selecione uma imagem");
    return;
  }

  salvarBtn.disabled = true;
  salvarBtn.textContent = "Salvando...";

  try {
    const file = foto.files[0];
    const caminho = `roupas/${Date.now()}_${file.name}`;
    const imgRef = ref(storage, caminho);

    /* ⬆️ UPLOAD REAL */
    await uploadBytes(imgRef, file);

    /* ✅ SÓ AGORA MOSTRA */
    msgFoto.textContent = "📸 Imagem enviada com sucesso";

    const url = await getDownloadURL(imgRef);

    await addDoc(roupasRef, {
      img: url,
      tipo: tipo.value,
      tamanho: tamanho.value || "",
      quantidade: quantidade.value || 1
    });

    msgSucesso.style.display = "block";

    setTimeout(() => {
      fecharModal();
    }, 1200);

  } catch (erro) {
    alert("Erro ao salvar. Tente novamente.");
    console.error(erro);
  }

  salvarBtn.disabled = false;
  salvarBtn.textContent = "Salvar";
};
