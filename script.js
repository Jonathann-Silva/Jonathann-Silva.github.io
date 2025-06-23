let usuario = "";

function entrar() {
  const input = document.getElementById("usernameInput");
  const nome = input.value.trim();
  if (nome === "") return;

  usuario = nome;
  document.getElementById("login").classList.add("hidden");
  document.getElementById("listaContainer").classList.remove("hidden");
  document.getElementById("usernameDisplay").textContent = usuario;
  carregarLista();
}

function carregarLista() {
  const dados = localStorage.getItem("lista_" + usuario);
  if (dados) {
    const itens = JSON.parse(dados);
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    itens.forEach(item => {
      adicionarElementoNaLista(item);
    });
  }
}

function adicionarItem() {
  const input = document.getElementById("itemInput");
  const texto = input.value.trim();
  if (texto === "") return;

  adicionarElementoNaLista(texto);
  salvarLista();
  input.value = "";
  input.focus();
}

function adicionarElementoNaLista(texto) {
  const lista = document.getElementById("lista");
  const li = document.createElement("li");
  li.innerHTML = `
    ${texto}
    <button onclick="removerItem(this)">Remover</button>
  `;
  lista.appendChild(li);
}

function removerItem(botao) {
  const li = botao.parentElement;
  li.remove();
  salvarLista();
}

function salvarLista() {
  const lista = [];
  document.querySelectorAll("#lista li").forEach(li => {
    lista.push(li.childNodes[0].textContent.trim());
  });
  localStorage.setItem("lista_" + usuario, JSON.stringify(lista));
}