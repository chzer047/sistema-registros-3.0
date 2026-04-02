let banco = [];

const arquivos = [
  "dados/bolsa.json"
];

async function carregarDados() {
  for (let arq of arquivos) {
    const res = await fetch(arq);
    const json = await res.json();
    banco.push(json);
  }
}

function buscar() {
  const texto = document.getElementById("busca").value.toLowerCase();

  let familia = texto.match(/familia (\d+)/)?.[1];
  let fabrica = texto.match(/fabrica (\d+)/)?.[1];
  let cliente = texto.match(/(bolsa)/)?.[1]?.toUpperCase();

  let resultado = [];

  banco.forEach(c => {
    if (c.cliente === cliente) {
      let dados = c.fabricas["Fabrica " + fabrica];
      if (dados) {
        dados.forEach(item => {
          if (item.familia === familia) resultado.push(item);
        });
      }
    }
  });

  document.getElementById("resultado").innerText =
    resultado.length ? JSON.stringify(resultado, null, 2) : "Nada encontrado";
}

carregarDados();
