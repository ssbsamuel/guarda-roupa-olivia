import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSk5DdL6zAkl9VO9IcNtMjXXNzkhBaZGk",
  authDomain: "guarda-roupa-olivia.firebaseapp.com",
  projectId: "guarda-roupa-olivia",
  storageBucket: "guarda-roupa-olivia.firebasestorage.app",
  messagingSenderId: "729428309934",
  appId: "1:729428309934:web:fdc7d7bda0299143813a3f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

const emailsPermitidos = [
  "ssbsamuel1007@gmail.com",
  "anajulia15ass@gmail.com"
];

const login = document.getElementById("login");
const appDiv = document.getElementById("app");

document.getElementById("btnGoogle").onclick = () =>
  signInWithPopup(auth, provider);

onAuthStateChanged(auth, (user) => {
  if (user && emailsPermitidos.includes(user.email)) {
    login.style.display = "none";
    appDiv.style.display = "block";
  } else if (user) {
    alert("Acesso não autorizado");
    signOut(auth);
  }
});

const roupasCol = collection(db, "roupas");
const lista = document.getElementById("lista");

onSnapshot(roupasCol, (snap) => {
  lista.innerHTML = "";
  snap.forEach(doc => {
    const r = doc.data();
    lista.innerHTML += `
      <div class="card">
        <img src="${r.img}">
        <b>${r.tipo}</b><br>
        Tam: ${r.tamanho}<br>
        Qtde: ${r.quantidade}
      </div>`;
  });
});

document.getElementById("btnAdd").onclick = () =>
  document.getElementById("modal").style.display = "flex";

document.getElementById("cancelar").onclick = () =>
  document.getElementById("modal").style.display = "none";

document.getElementById("salvar").onclick = async () => {
  const foto = document.getElementById("foto").files[0];
  const tipo = document.getElementById("tipo").value;
  const tamanho = document.getElementById("tamanho").value;
  const quantidade = document.getElementById("quantidade").value;

  if (!foto || !tipo || !tamanho || !quantidade) return;

  const imgRef = ref(storage, `roupas/${Date.now()}`);
  await uploadBytes(imgRef, foto);
  const url = await getDownloadURL(imgRef);

  await addDoc(roupasCol, { img: url, tipo, tamanho, quantidade });

  document.getElementById("modal").style.display = "none";
};
