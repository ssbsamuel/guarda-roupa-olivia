import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
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

const lista = document.getElementById("lista");
const modal = document.getElementById("modal");
const btnAdd = document.getElementById("btnAdd");
const cancelar = document.getElementById("cancelar");
const salvar = document.getElementById("salvar");
const foto = document.getElementById("foto");
const msgFoto = document.getElementById("msgFoto");
const msgSucesso = document.getElementById("msgSucesso");

let categoriaAtual = "Todos";

btnAdd.onclick = () => modal.style.display = "flex";
cancelar.onclick = () => modal.style.display = "none";

foto.onchange = () => msgFoto.innerText = "📸 Imagem carregada";

document.querySelectorAll("nav button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll("nav button").forEach(b => b.classList.remove("ativo"));
    btn.classList.add("ativo");
    categoriaAtual = btn.dataset.cat;
    render();
  };
});

const roupasRef = collection(db, "roupas");
let roupas = [];

onSnapshot(roupasRef, snap => {
  roupas = [];
  snap.forEach(doc => roupas.push(doc.data()));
  render();
});

function render() {
  lista.innerHTML = "";
  roupas
    .filter(r => categoriaAtual === "Todos" || r.tipo === categoriaAtual)
    .forEach(r => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <img src="${r.img}">
        <strong>${r.tipo}</strong><br>
        Tam: ${r.tamanho}<br>
        Qtd: ${r.quantidade}
      `;
      lista.appendChild(div);
    });
}

salvar.onclick = async () => {
  if (!foto.files.length) return alert("Selecione a foto");

  const imgRef = ref(storage, "roupas/" + Date.now());
  await uploadBytes(imgRef, foto.files[0]);
  const url = await getDownloadURL(imgRef);

  await addDoc(roupasRef, {
    img: url,
    tipo: tipo.value,
    tamanho: tamanho.value,
    quantidade: quantidade.value
  });

  msgSucesso.style.display = "block";
  setTimeout(() => {
    msgSucesso.style.display = "none";
    modal.style.display = "none";
  }, 1200);
};
