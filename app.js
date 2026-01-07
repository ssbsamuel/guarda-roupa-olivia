// =======================
// FIREBASE INIT
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyDSk5DdL6zAkl9VO9IcNtMjXXNzkhBaZGk",
  authDomain: "guarda-roupa-olivia.firebaseapp.com",
  projectId: "guarda-roupa-olivia",
  storageBucket: "guarda-roupa-olivia.firebasestorage.app",
  messagingSenderId: "729428309934",
  appId: "1:729428309934:web:fdc7d7bda0299143813a3f"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();

// =======================
// VARIÁVEIS
// =======================
let filtroAtual = "Todos";

// =======================
// MODAL
// =======================
function abrirModal() {
  document.getElementById("modalBg").style.display = "flex";
}

function resetModal() {
  document.getElementById("imagem").value = "";
  document.getElementById("tamanho").value = "";
  document.getElementById("quantidade").value = "";
  document.getElementById("msgUpload").innerText = "";

  const btn = document.getElementById("btnSalvar");
  btn.disabled = false;
  btn.textContent = "Salvar";
}

function fecharModal() {
  resetModal();
  document.getElementById("modalBg").style.display = "none";
}

// =======================
// UPLOAD IMAGE FEEDBACK
// =======================
document.getElementById("imagem").addEventListener("change", () => {
  document.getElementById("msgUpload").innerText = "";
});

// =======================
// SALVAR ROUPA
// =======================
async function salvar() {
  const fileInput = document.getElementById("imagem");
  const file = fileInput.files[0];

  if (!file) {
    alert("Escolha uma imagem");
    return;
  }

  const btn = document.getElementById("btnSalvar");
  btn.disabled = true;
  btn.textContent = "Salvando...";

  try {
    const nomeUnico = Date.now() + "_" + file.name;
    const ref = storage.ref("roupas/" + nomeUnico);

    // Upload REAL
    await ref.put(file);

    // Agora sim a imagem foi carregada
    document.getElementById("msgUpload").innerText = "📸 Imagem carregada";

    const url = await ref.getDownloadURL();

    await db.collection("roupas").add({
      tipo: document.getElementById("tipo").value,
      tamanho: document.getElementById("tamanho").value || "",
      quantidade: document.getElementById("quantidade").value || "",
      imagem: url,
      criadoEm: new Date()
    });

    fecharModal();

  } catch (erro) {
    console.error(erro);
    alert("Erro ao salvar");
    resetModal();
  }
}

// =======================
// LISTAR ROUPAS (REALTIME)
// =======================
db.collection("roupas").orderBy("criadoEm", "desc").onSnapshot(() => {
  carregar();
});

async function carregar() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const snapshot = await db.collection("roupas").orderBy("criadoEm", "desc").get();

  snapshot.forEach(doc => {
    const r = doc.data();

    if (filtroAtual !== "Todos" && r.tipo !== filtroAtual) return;

    lista.innerHTML += `
      <div class="card">
        <img src="${r.imagem}">
        <div class="info">
          <strong>${r.tipo}</strong><br>
          ${r.tamanho ? r.tamanho + " | " : ""}Qtde: ${r.quantidade || "1"}
        </div>
        <button onclick="excluir('${doc.id}', '${r.imagem}')">Excluir</button>
      </div>
    `;
  });
}

// =======================
// EXCLUIR
// =======================
async function excluir(id, imagem) {
  if (!confirm("Deseja excluir?")) return;

  await db.collection("roupas").doc(id).delete();

  try {
    await storage.refFromURL(imagem).delete();
  } catch (e) {
    console.warn("Imagem já removida");
  }
}

// =======================
// FILTRO
// =======================
function filtrar(tipo, btn) {
  filtroAtual = tipo;

  document.querySelectorAll(".filtro button").forEach(b => {
    b.classList.remove("ativo");
  });

  btn.classList.add("ativo");
  carregar();
}
