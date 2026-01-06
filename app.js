import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSk5DdL6zAkl9VO9IcNtMjXXNzkhBaZGk",
  authDomain: "guarda-roupa-olivia.firebaseapp.com",
  projectId: "guarda-roupa-olivia",
  storageBucket: "guarda-roupa-olivia.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

const login = document.getElementById("login");
const appDiv = document.getElementById("app");
const btnGoogle = document.getElementById("btnGoogle");

btnGoogle.onclick = () => signInWithPopup(auth, provider);

onAuthStateChanged(auth, (user) => {
  if (user) {
    login.style.display = "none";
    appDiv.style.display = "block";
  }
});

const lista = document.getElementById("lista");
const modal = document.getElementById("modal");
document.getElementById("btnAdd").onclick = () => modal.style.display = "flex";
document.getElementById("cancelar").onclick = () => modal.style.display = "none";

const roupasCol = collection(db, "roupas");

onSnapshot(roupasCol, (snap) => {
  lista.innerHTML = "";
  snap.forEach(doc => {
    const r = doc.data();
    lista.innerHTML += `
      <div class="card">
        <img src="${r.img}">
        <b>${r.tipo}</b><br>
        Tam: ${r.tamanho}<br>
        Qtd: ${r.quantidade}
      </div>
    `;
  });
});

document.getElementById("salvar").onclick = async () => {
  const foto = document.getElementById("foto").files[0];
  const tipo = document.getElementById("tipo").value;
  const tamanho = document.getElementById("tamanho").value;
  const quantidade = document.getElementById("quantidade").value;

  const imgRef = ref(storage, `roupas/${Date.now()}.jpg`);
  await uploadBytes(imgRef, foto);
  const url = await getDownloadURL(imgRef);

  await addDoc(roupasCol, { img: url, tipo, tamanho, quantidade });
  modal.style.display = "none";
};
