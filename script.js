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

// NORMALIZA TEXTO (remove acento e padroniza)
function normalizar(txt) {
  return txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// BUSCA INTELIGENTE
function buscar() {
  const texto = normalizar(document.getElementById("busca").value);

  let familia = texto.match(/(\d+)/)?.[1]; // pega qualquer número
  let fabricaNum = texto.match(/fab(?:rica)?\s*(\d+)/)?.[1];
  let cliente = texto.match(/(bolsa|cliente2|cliente3)/)?.[1]?.toUpperCase();

  let resultado = [];

  banco.forEach(c => {
    if (!cliente || c.cliente === cliente) {

      Object.keys(c.fabricas).forEach(nomeFabrica => {

        let nomeNormalizado = normalizar(nomeFabrica);

        if (!fabricaNum || nomeNormalizado.includes(fabricaNum)) {

          let dados = c.fabricas[nomeFabrica];

          dados.forEach(item => {
            if (!familia || String(item.familia) === familia) {
              resultado.push({
                cliente: c.cliente,
                fabrica: nomeFabrica,
                ...item
              });
            }
          });

        }

      });

    }
  });

  exibir(resultado);
}

// EXIBIÇÃO BONITA + STATUS DE VALIDADE
function exibir(dados) {
  const div = document.getElementById("resultado");

  if (!dados.length) {
    div.innerHTML = "❌ Nada encontrado";
    return;
  }

  div.innerHTML = dados.map(d => {
    let statusCor = "#2ecc71"; // verde

    if (d.validade) {
      let partes = d.validade.split("/");
      let data = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
      let hoje = new Date();

      let diff = (data - hoje) / (1000 * 60 * 60 * 24);

      if (diff < 0) statusCor = "#e74c3c"; // vencido
      else if (diff < 30) statusCor = "#f1c40f"; // próximo
    }

    return `
      <div style="
        background:#1a1a1a;
        padding:15px;
        border-radius:10px;
        margin-bottom:15px;
        text-align:left;
        border-left:5px solid ${statusCor};
      ">
        <strong>📦 Cliente:</strong> ${d.cliente}<br>
        <strong>🏭 Fábrica:</strong> ${d.fabrica}<br>
        <strong>🔢 Família:</strong> ${d.familia}<br>
        <strong>📄 Registro:</strong> ${d.registro}<br>
        <strong>📅 Validade:</strong> ${d.validade}<br>
        <strong>🔧 Manutenção:</strong> ${d.manutencao || "—"}
      </div>
    `;
  }).join("");
}

carregarDados();
