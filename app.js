const filtros = document.querySelectorAll(".filtro");
const lista = document.getElementById("lista");
const abrirModal = document.getElementById("abrirModal");
const modal = document.getElementById("modal");
const salvarBtn = document.getElementById("salvar");
const cancelarBtn = document.getElementById("cancelar");

const inputFoto = document.getElementById("foto");
const inputTipo = document.getElementById("tipo");
const inputTamanho = document.getElementById("tamanho");
const inputQuantidade = document.getElementById("quantidade");

let roupas = [];
let filtroAtivo = "Todos";

/* FILTROS */
filtros.forEach(botao => {
  botao.addEventListener("click", () => {
    filtros.forEach(b => b.classList.remove("ativo"));
    botao.classList.add("ativo");
    filtroAtivo = botao.dataset.tipo;
    renderizar();
  });
});

/* MODAL */
abrirModal.onclick = () => modal.style.display = "block";
cancelarBtn.onclick = fecharModal;

modal.onclick = (e) => {
  if (e.target === modal) fecharModal();
};

function fecharModal() {
  modal.style.display = "none";
  inputFoto.value = "";
  inputTipo.value = "";
  inputTamanho.value = "";
  inputQuantidade.value = "";
}

/* SALVAR */
salvarBtn.onclick = () => {
  if (!inputFoto.files[0] || !inputTipo.value) {
    alert("Selecione imagem e tipo");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    roupas.push({
      tipo: inputTipo.value,
      tamanho: inputTamanho.value || "-",
      quantidade: inputQuantidade.value || 1,
      imagem: reader.result
    });
    fecharModal();
    renderizar();
  };
  reader.readAsDataURL(inputFoto.files[0]);
};

/* RENDER */
function renderizar() {
  lista.innerHTML = "";

  const filtradas = filtroAtivo === "Todos"
    ? roupas
    : roupas.filter(r => r.tipo === filtroAtivo);

  filtradas.forEach((r, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${r.imagem}">
      <p>${r.tipo}</p>
      <p>Tam: ${r.tamanho}</p>
      <p>Qtd: ${r.quantidade}</p>
      <button data-i="${i}">Excluir</button>
    `;
    card.querySelector("button").onclick = () => {
      roupas.splice(i, 1);
      renderizar();
    };
    lista.appendChild(card);
  });
}
