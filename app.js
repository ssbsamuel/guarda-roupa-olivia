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
const salvar = document.getElementById("salvar");
const cancelar = document.getElementById("cancelar");
const toast = document.getElementById("toast");

btnAdd.onclick = () => modal.style.display = "flex";
cancelar.onclick = () => modal.style.display = "none";

const roupasRef = collection(db, "roupas");

onSnapshot(roupasRef, snap => {
  lista.innerHTML = "";
  snap.forEach(doc => {
    const r = doc.data();
    lista.innerHTML += `
      <div class="card">
        <img src="${r.img}">
        <b>${r.tipo}</b><br>
        Tam: ${r.tamanho}<br>
        Qtde: ${r.quantidade}
      </div>
    `;
  });
});

salvar.onclick = async () => {
  const foto = document.getElementById("foto").files[0];
  const tipo = document.getElementById("tipo").value;
  const tamanho = document.getElementById("tamanho").value;
  const quantidade = document.getElementById("quantidade").value;

  if (!foto || !tipo || !tamanho || !quantidade) {
    alert("Preencha tudo");
    return;
  }

  const imgRef = ref(storage, `roupas/${Date.now()}_${foto.name}`);
  await uploadBytes(imgRef, foto);
  const url = await getDownloadURL(imgRef);

  await addDoc(roupasRef, {
    img: url,
    tipo,
    tamanho,
    quantidade
  });

  modal.style.display = "none";
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 1500);
};
