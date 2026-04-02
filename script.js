<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<title>Sistema de Registros</title>

<style>
body {
  background: #0b0b0b;
  color: white;
  font-family: Arial;
  text-align: center;
}

select, button {
  padding: 10px;
  margin: 10px;
  border-radius: 8px;
  border: none;
}

.card {
  background: #1a1a1a;
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
}
</style>
</head>

<body>

<h2>Consulta</h2>

<select id="cliente"></select>
<select id="fabrica"></select>
<select id="familia"></select>

<button onclick="buscar()">Buscar</button>

<div id="resultado"></div>

<script>
let banco = [];

async function carregar() {
  const res = await fetch("dados/bolsa.json");
  const json = await res.json();

  banco.push(json);

  const clienteSelect = document.getElementById("cliente");

  banco.forEach((c, i) => {
    clienteSelect.innerHTML += `<option value="${i}">${c.cliente}</option>`;
  });

  atualizarFabricas();
}

function atualizarFabricas() {
  const clienteIndex = document.getElementById("cliente").value;
  const fabricaSelect = document.getElementById("fabrica");

  fabricaSelect.innerHTML = "";

  const cliente = banco[clienteIndex];

  Object.keys(cliente.fabricas).forEach(f => {
    fabricaSelect.innerHTML += `<option>${f}</option>`;
  });

  atualizarFamilias();
}

function atualizarFamilias() {
  const clienteIndex = document.getElementById("cliente").value;
  const fabricaNome = document.getElementById("fabrica").value;

  const familiaSelect = document.getElementById("familia");
  familiaSelect.innerHTML = "";

  const dados = banco[clienteIndex].fabricas[fabricaNome];

  dados.forEach(d => {
    familiaSelect.innerHTML += `<option>${d.familia}</option>`;
  });
}

function buscar() {
  const clienteIndex = document.getElementById("cliente").value;
  const fabricaNome = document.getElementById("fabrica").value;
  const familia = document.getElementById("familia").value;

  const dados = banco[clienteIndex].fabricas[fabricaNome];

  const item = dados.find(d => d.familia === familia);

  if (!item) {
    document.getElementById("resultado").innerHTML = "❌ Nada encontrado";
    return;
  }

  document.getElementById("resultado").innerHTML = `
    <div class="card">
      <b>Cliente:</b> ${banco[clienteIndex].cliente}<br>
      <b>Fábrica:</b> ${fabricaNome}<br>
      <b>Família:</b> ${item.familia}<br>
      <b>Registro:</b> ${item.registro}<br>
      <b>Validade:</b> ${item.validade}<br>
    </div>
  `;
}

// eventos
document.getElementById("cliente").onchange = atualizarFabricas;
document.getElementById("fabrica").onchange = atualizarFamilias;

carregar();
</script>

</body>
</html>
