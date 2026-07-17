// =========================
// 1. DADOS DA INTERFACE
// =========================

const maquinas = [
  { nome: "CNC 01", estado: "Online", cor: "verde", temperatura: "42°C", eficiencia: "75%", linhaCinza: true },
  { nome: "Prensa 02", estado: "Atenção", cor: "amarelo", temperatura: "65°C", eficiencia: "60%" },
  { nome: "Solda 03", estado: "Online", cor: "verde", temperatura: "38°C", eficiencia: "90%" },
  { nome: "Pintura 04", estado: "Parada", cor: "vermelho", temperatura: "-", eficiencia: "0%", semLinha: true },
  { nome: "CNC 05", estado: "Online", cor: "verde", temperatura: "45°C", eficiencia: "80%" }
];

const produtos = [
  { nome: "Produto A", valor: 450, porcentagem: 36, cor: "#2d8cff" },
  { nome: "Produto B", valor: 320, porcentagem: 26, cor: "#55c84f" },
  { nome: "Produto C", valor: 280, porcentagem: 22, cor: "#ffbd19" },
  { nome: "Produto D", valor: 150, porcentagem: 12, cor: "#8e45e8" },
  { nome: "Outros", valor: 50, porcentagem: 4, cor: "#596574" }
];

const configuracoesGraficos = {
  producao: {
    cor: "#2d8cff",
    maximo: 2000,
    rotulos: ["2k", "1.5k", "1k", "500", "0"],
    valores: [430, 520, 710, 820, 1000, 1050, 1010, 1190, 1400, 1160, 1210, 930, 900, 920, 1010, 1160, 1080, 1130, 1090, 1420, 1600, 1280, 1550, 1710]
  },
  energia: {
    cor: "#55c84f",
    maximo: 4000,
    rotulos: ["4k", "3k", "2k", "1k", "0"],
    valores: [1450, 1570, 1900, 1980, 1780, 1910, 2550, 2590, 2450, 2700, 2410, 2120, 2470, 2600, 2950, 2550, 2740, 2450, 2850, 2670, 2900, 3000]
  }
};

const pontosMiniGrafico = "0,15 6,13 12,14 18,11 24,15 30,12 36,5 42,7 48,13 54,15 60,10 66,14 74,15 80,13";

// =========================
// 2. RENDERIZAÇÃO DAS LISTAS
// =========================

function criarMiniGrafico(maquina) {
  if (maquina.semLinha) return "<span></span>";

  const classeCinza = maquina.linhaCinza ? "cinza" : "";
  return `
    <svg class="mini-linha ${classeCinza}" viewBox="0 0 80 24" aria-hidden="true">
      <polyline points="${pontosMiniGrafico}"></polyline>
    </svg>
  `;
}

function montarMaquinas() {
  const lista = document.querySelector("#listaMaquinas");

  lista.innerHTML = maquinas.map((maquina) => `
    <div class="maquina-item">
      <i data-lucide="monitor-cog"></i>
      <div class="maquina-nome">
        <strong>${maquina.nome}</strong>
        <small class="${maquina.cor}">${maquina.estado}</small>
      </div>
      <span>${maquina.temperatura}</span>
      ${criarMiniGrafico(maquina)}
      <span>${maquina.eficiencia}</span>
    </div>
  `).join("");
}

function montarProdutos() {
  const lista = document.querySelector("#listaProdutos");

  lista.innerHTML = produtos.map((produto) => `
    <div class="produto-item">
      <span>${produto.nome}</span>
      <div class="barra">
        <span style="width: ${produto.porcentagem * 1.3}%; background: ${produto.cor}"></span>
      </div>
      <b>${produto.valor}</b>
      <small>${produto.porcentagem}%</small>
    </div>
  `).join("");
}

// =========================
// 3. GRÁFICOS PRINCIPAIS
// =========================

function calcularPontos(valores, medidas, maximo) {
  const { esquerda, topo, larguraUtil, alturaUtil } = medidas;

  return valores.map((valor, indice) => {
    const x = esquerda + (indice / (valores.length - 1)) * larguraUtil;
    const y = topo + alturaUtil - (valor / maximo) * alturaUtil;
    return `${x},${y}`;
  });
}

function criarLinhasDeGrade(rotulos, medidas) {
  const { largura, direita, esquerda, topo, alturaUtil } = medidas;

  return rotulos.map((rotulo, indice) => {
    const y = topo + indice * (alturaUtil / (rotulos.length - 1));
    return `
      <line class="linha-grade" x1="${esquerda}" x2="${largura - direita}" y1="${y}" y2="${y}"></line>
      <text class="rotulo-grafico" x="2" y="${y + 4}">${rotulo}</text>
    `;
  }).join("");
}

function criarGrafico(elemento, configuracao) {
  const medidas = {
    largura: 370,
    altura: 230,
    esquerda: 40,
    direita: 10,
    topo: 15,
    base: 28
  };

  medidas.larguraUtil = medidas.largura - medidas.esquerda - medidas.direita;
  medidas.alturaUtil = medidas.altura - medidas.topo - medidas.base;

  const pontos = calcularPontos(configuracao.valores, medidas, configuracao.maximo);
  const linhas = criarLinhasDeGrade(configuracao.rotulos, medidas);
  const fimDoGrafico = medidas.largura - medidas.direita;
  const baseDoGrafico = medidas.topo + medidas.alturaUtil;
  const area = `${pontos.join(" ")} ${fimDoGrafico},${baseDoGrafico} ${medidas.esquerda},${baseDoGrafico}`;
  const circulos = pontos.map((ponto) => {
    const [x, y] = ponto.split(",");
    return `<circle class="ponto-grafico" cx="${x}" cy="${y}" r="3" stroke="${configuracao.cor}"></circle>`;
  }).join("");

  elemento.innerHTML = `
    <svg viewBox="0 0 ${medidas.largura} ${medidas.altura}" preserveAspectRatio="none" aria-label="Gráfico das últimas 24 horas">
      ${linhas}
      <polygon class="area-grafico" points="${area}" fill="${configuracao.cor}"></polygon>
      <polyline class="linha-grafico" points="${pontos.join(" ")}" stroke="${configuracao.cor}"></polyline>
      ${circulos}
      <text class="rotulo-grafico" x="33" y="225">00:00</text>
      <text class="rotulo-grafico" x="105" y="225">06:00</text>
      <text class="rotulo-grafico" x="185" y="225">12:00</text>
      <text class="rotulo-grafico" x="265" y="225">18:00</text>
      <text class="rotulo-grafico" x="328" y="225">23:59</text>
    </svg>
  `;
}

function montarGraficos() {
  document.querySelectorAll(".grafico").forEach((elemento) => {
    criarGrafico(elemento, configuracoesGraficos[elemento.dataset.tipo]);
  });
}

// =========================
// 4. MENU E INICIALIZAÇÃO
// =========================

function configurarMenuMovel() {
  const barraLateral = document.querySelector("#barraLateral");
  const fundoMenu = document.querySelector("#fundoMenu");
  const botaoMenu = document.querySelector("#botaoMenu");

  function alternarMenu() {
    barraLateral.classList.toggle("aberta");
    fundoMenu.classList.toggle("ativo");
  }

  botaoMenu.addEventListener("click", alternarMenu);
  fundoMenu.addEventListener("click", alternarMenu);
}

function iniciarPainel() {
  montarMaquinas();
  montarProdutos();
  montarGraficos();
  configurarMenuMovel();

  if (window.lucide) lucide.createIcons();
}

document.addEventListener("DOMContentLoaded", iniciarPainel);
