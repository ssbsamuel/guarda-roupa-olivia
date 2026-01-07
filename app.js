// 🔥 CONFIG FIREBASE (use a sua)
firebase.initializeApp({
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
});

const db = firebase.firestore();
const storage = firebase.storage();

const categorias = [
  "Todos","Laços","Body","Calça/Short","Macacão","Jardineira",
  "Vestido","Conjunto","Meia/Luva","Sapato","Cueiro",
  "Cobertor","Lencol","Toalha de Banho","Pano de Boca","Kit Higiene","Fraldas"
];

const categoriasDiv = document.getElementById("categorias");
const lista = document.getElementById("lista");
const selectTipo = document.getElementById("tipo");

categorias.forEach(c => {
  const b = document.createElement("button");
  b.textContent = c;
  if (c === "Todos") b.classList.add("ativo");
  b.onclick = () => filtrar(c, b);
  categoriasDiv.appendChild(b);

  if (c !== "Todos") {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    selectTipo.appendChild(opt);
  }
});

function abrirModal() {
  document.getElementById("modalBg").style.display = "block";
}

function fecharModal() {
  document.getElementById("modalBg").style.display = "none";
}

async function salvar() {
  const file = document.getElementById("imagem").files[0];
  if (!file) return alert("Escolha uma imagem");

  const btn = document.getElementById("btnSalvar");
  btn.disabled = true;
  btn.textContent = "Salvando...";

  try {
    const nomeUnico = Date.now() + "_" + file.name;
    const ref = storage.ref("roupas/" + nomeUnico);

    await ref.put(file);
    const url = await ref.getDownloadURL();

    await db.collection("roupas").add({
      tipo: selectTipo.value,
      tamanho: document.getElementById("tamanho").value || "",
      quantidade: document.getElementById("quantidade").value || "",
      imagem: url,
      criadoEm: new Date()
    });

    fecharModal();
    btn.disabled = false;
    btn.textContent = "Salvar";
    carregar();

  } catch (e) {
    alert("Erro ao salvar");
    console.error(e);
    btn.disabled = false;
    btn.textContent = "Salvar";
  }
}

function carregar() {
  lista.innerHTML = "";
  db.collection("roupas").orderBy("criadoEm","desc").onSnapshot(snap => {
    lista.innerHTML = "";
    snap.forEach(doc => {
      const d = doc.data();
      lista.innerHTML += `
        <div class="card">
          <img src="${d.imagem}">
          <p>${d.tipo}</p>
          <p>${d.tamanho} | Qtde: ${d.quantidade}</p>
        </div>
      `;
    });
  });
}

function filtrar(cat, btn) {
  document.querySelectorAll(".categorias button").forEach(b => b.classList.remove("ativo"));
  btn.classList.add("ativo");
}

carregar();
