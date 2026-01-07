const categorias = [
  "Todos","Laços","Body","Calça/Short","Macacão","Jardineira",
  "Vestido","Conjunto","Meia/Luva","Sapato","Cueiro","Cobertor",
  "Lencol","Toalha de Banho","Pano de Boca","Kit Higiene","Fraldas"
];

let roupas = JSON.parse(localStorage.getItem("roupas")) || [];
let filtroAtual = "Todos";

const filtros = document.getElementById("filtros");
const lista = document.getElementById("lista");
const modal = document.getElementById("modal");
const foto = document.getElementById("foto");
const tipo = document.getElementById("tipo");
const tamanho = document.getElementById("tamanho");
const quantidade = document.getElementById("quantidade");
const msgFoto = document.getElementById("msgFoto");

// FILTROS
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

  if (cat !== "Todos") {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    tipo.appendChild(opt);
  }
});

document.getElementById("btnAdd").onclick = () => modal.style.display = "flex";
document.getElementById("cancelar").onclick = () => modal.style.display = "none";

foto.onchange = () => msgFoto.textContent = "📸 Imagem carregada";

document.getElementById("salvar").onclick = () => {
  if (!foto.files.length) return alert("Selecione uma imagem");

  const reader = new FileReader();
  reader.onload = () => {
    roupas.push({
      id: Date.now(),
      img: reader.result,
      tipo: tipo.value,
      tamanho: tamanho.value,
      quantidade: quantidade.value || 1
    });

    localStorage.setItem("roupas", JSON.stringify(roupas));
    modal.style.display = "none";
    foto.value = "";
    tamanho.value = "";
    quantidade.value = "";
    msgFoto.textContent = "";
    render();
  };
  reader.readAsDataURL(foto.files[0]);
};

function render() {
  lista.innerHTML = "";
  roupas
    .filter(r => filtroAtual === "Todos" || r.tipo === filtroAtual)
    .forEach(r => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <img src="${r.img}">
        <b>${r.tipo}</b><br>
        ${r.tamanho || ""} | Qtde: ${r.quantidade}
        <br><button onclick="excluir(${r.id})">Excluir</button>
      `;
      lista.appendChild(div);
    });
}

function excluir(id) {
  roupas = roupas.filter(r => r.id !== id);
  localStorage.setItem("roupas", JSON.stringify(roupas));
  render();
}

render();
