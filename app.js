const categorias = [
  "Todos","Laços","Body","Calça/Short","Macacão","Jardineira",
  "Vestido","Conjunto","Meia/Luva","Sapato","Cueiro",
  "Cobertor","Lencol","Toalha de Banho","Pano de Boca",
  "Kit Higiene","Fraldas"
];

let roupas = JSON.parse(localStorage.getItem("roupas")) || [];
let filtroAtual = "Todos";

const filtrosDiv = document.getElementById("filtros");
const listaDiv = document.getElementById("lista");
const tipoSelect = document.getElementById("tipo");
const modal = document.getElementById("modal");
const msg = document.getElementById("msg");

categorias.forEach(cat => {
  const btn = document.createElement("button");
  btn.innerText = cat;
  if (cat === "Todos") btn.classList.add("ativo");
  btn.onclick = () => {
    filtroAtual = cat;
    document.querySelectorAll(".filtros button").forEach(b => b.classList.remove("ativo"));
    btn.classList.add("ativo");
    renderizar();
  };
  filtrosDiv.appendChild(btn);

  if (cat !== "Todos") {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.innerText = cat;
    tipoSelect.appendChild(opt);
  }
});

function abrirModal() {
  modal.style.display = "block";
}

function fecharModal() {
  modal.style.display = "none";
  msg.innerText = "";
  document.getElementById("foto").value = "";
  document.getElementById("tamanho").value = "";
  document.getElementById("quantidade").value = "";
}

function salvar() {
  const foto = document.getElementById("foto").files[0];
  const tipo = tipoSelect.value;
  const tamanho = document.getElementById("tamanho").value;
  const quantidade = document.getElementById("quantidade").value;

  if (!foto || !tipo || !tamanho || !quantidade) {
    alert("Preencha tudo");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    roupas.push({
      id: Date.now(),
      tipo,
      tamanho,
      quantidade,
      foto: reader.result
    });
    localStorage.setItem("roupas", JSON.stringify(roupas));
    msg.innerText = "Adicionado com sucesso ✅";
    renderizar();
    setTimeout(fecharModal, 1200);
  };
  reader.readAsDataURL(foto);
}

function excluir(id) {
  if (!confirm("Excluir item?")) return;
  roupas = roupas.filter(r => r.id !== id);
  localStorage.setItem("roupas", JSON.stringify(roupas));
  renderizar();
}

function renderizar() {
  listaDiv.innerHTML = "";
  roupas
    .filter(r => filtroAtual === "Todos" || r.tipo === filtroAtual)
    .forEach(r => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <img src="${r.foto}">
        <small>${r.tipo}</small>
        <small>${r.tamanho} | Qtde: ${r.quantidade}</small>
        <button onclick="excluir(${r.id})">Excluir</button>
      `;
      listaDiv.appendChild(div);
    });
}

renderizar();
