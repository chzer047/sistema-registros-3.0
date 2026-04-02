let banco = [];

const arquivos = [
  "dados/bolsa.json"
];

// CARREGA
async function carregarDados() {
  for (let arq of arquivos) {
    const res = await fetch(arq);
    const json = await res.json();
    banco.push(json);
  }
}

// BUSCA TOTAL (SEM FRESCURA)
function buscar() {
  const texto = document.getElementById("busca").value.toLowerCase();

  let numeros = texto.match(/\d+/g) || [];

  let familia = numeros[0];
  let fabricaNum = numeros[1];

  let resultado = [];

  banco.forEach(c => {

    Object.keys(c.fabricas).forEach(nomeFabrica => {

      // verifica número da fábrica
      if (!fabricaNum || nomeFabrica.includes(fabricaNum)) {

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

  });

  exibir(resultado);
}

// EXIBIÇÃO
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
