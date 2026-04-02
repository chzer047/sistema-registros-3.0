let banco = [];

const arquivos = [
  "dados/bolsa.json"
];

// CARREGA DADOS
async function carregarDados() {
  for (let arq of arquivos) {
    const res = await fetch(arq);
    const json = await res.json();
    banco.push(json);
  }
}

// BUSCA
function buscar() {
  const texto = document.getElementById("busca").value.toLowerCase();

  let familia = texto.match(/familia (\d+)/)?.[1];
  let fabrica = texto.match(/fabrica (\d+)/)?.[1];
  let cliente = texto.match(/(bolsa)/)?.[1]?.toUpperCase();

  let resultado = [];

  banco.forEach(c => {
    if (c.cliente === cliente) {
      let nomeFabrica = "Fabrica " + fabrica;

      let dados = c.fabricas[nomeFabrica];

      if (dados) {
        dados.forEach(item => {
          if (item.familia == familia) {
            resultado.push({
              cliente: c.cliente,
              fabrica: nomeFabrica,
              ...item
            });
          }
        });
      }
    }
  });

  exibir(resultado);
}

// EXIBIÇÃO BONITA
function exibir(dados) {
  const div = document.getElementById("resultado");

  if (!dados.length) {
    div.innerHTML = "❌ Nada encontrado";
    return;
  }

  div.innerHTML = dados.map(d => `
    <div style="
      background:#1a1a1a;
      padding:15px;
      border-radius:10px;
      margin-bottom:15px;
      text-align:left;
    ">
      <strong>📦 Cliente:</strong> ${d.cliente}<br>
      <strong>🏭 Fábrica:</strong> ${d.fabrica}<br>
      <strong>🔢 Família:</strong> ${d.familia}<br>
      <strong>📄 Registro:</strong> ${d.registro}<br>
      <strong>📅 Validade:</strong> ${d.validade}<br>
      <strong>🔧 Manutenção:</strong> ${d.manutencao || "—"}
    </div>
  `).join("");
}

carregarDados();
