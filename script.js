// EcoFactory - painel administrativo
// Os dados ficam no navegador enquanto a API não estiver conectada ao front-end.

const dadosIniciais = {
  maquinas: [
    { id: 1, codigo: "CNC-01", nome: "CNC 01", tipo: "CNC", localizacao: "Linha 1", status: "online", temperatura: 42, eficiencia: 75 },
    { id: 2, codigo: "PRENSA-02", nome: "Prensa 02", tipo: "Prensa", localizacao: "Linha 1", status: "atencao", temperatura: 65, eficiencia: 60 },
    { id: 3, codigo: "SOLDA-03", nome: "Solda 03", tipo: "Solda", localizacao: "Linha 2", status: "online", temperatura: 38, eficiencia: 90 },
    { id: 4, codigo: "PINTURA-04", nome: "Pintura 04", tipo: "Pintura", localizacao: "Linha 2", status: "parada", temperatura: 0, eficiencia: 0 },
    { id: 5, codigo: "CNC-05", nome: "CNC 05", tipo: "CNC", localizacao: "Linha 3", status: "online", temperatura: 45, eficiencia: 80 }
  ],
  producoes: [
    { id: 1, ordem: "OP-2026-001", produto: "Produto A", maquina: "CNC 01", quantidade: 450, meta: 500, status: "em_andamento", data: "2026-07-23" },
    { id: 2, ordem: "OP-2026-002", produto: "Produto B", maquina: "Prensa 02", quantidade: 320, meta: 400, status: "em_andamento", data: "2026-07-23" },
    { id: 3, ordem: "OP-2026-003", produto: "Produto C", maquina: "Solda 03", quantidade: 280, meta: 280, status: "concluida", data: "2026-07-23" },
    { id: 4, ordem: "OP-2026-004", produto: "Produto D", maquina: "Pintura 04", quantidade: 150, meta: 300, status: "pausada", data: "2026-07-23" }
  ],
  alertas: [
    { id: 1, nivel: "critico", titulo: "Temperatura alta na Máquina 07", descricao: "85°C detectados", horario: "14:32", resolvido: false },
    { id: 2, nivel: "atencao", titulo: "Vibração anormal na Prensa 02", descricao: "Nível acima do permitido", horario: "13:47", resolvido: false },
    { id: 3, nivel: "informacao", titulo: "Manutenção concluída - CNC 03", descricao: "Máquina retornou à operação", horario: "11:20", resolvido: true }
  ],
  funcionarios: [
    { id: 1, nome: "Arthur Bergs", matricula: "FUN-001", cargo: "Administrador", email: "arthur@ecofactory.local", turno: "Comercial", ativo: true },
    { id: 2, nome: "Marina Souza", matricula: "FUN-002", cargo: "Supervisora de produção", email: "marina@ecofactory.local", turno: "Manhã", ativo: true },
    { id: 3, nome: "Carlos Lima", matricula: "FUN-003", cargo: "Operador", email: "carlos@ecofactory.local", turno: "Tarde", ativo: true }
  ],
  configuracoes: { fabrica: "EcoFactory", email: "contato@ecofactory.local", metaEnergia: 3200, metaCo2: 800, notificacoes: true }
};

const producao24h = [430, 520, 710, 820, 1000, 1050, 1010, 1190, 1400, 1160, 1210, 930, 900, 920, 1010, 1160, 1080, 1130, 1090, 1420, 1600, 1280, 1550, 1710];
const energia24h = [1450, 1570, 1900, 1980, 1780, 1910, 2550, 2590, 2450, 2700, 2410, 2120, 2470, 2600, 2950, 2550, 2740, 2450, 2850, 2670, 2900, 3000];

let dados = carregarDados();
let paginaAtual = "dashboard";

const paginas = {
  dashboard: { titulo: "Dashboard", subtitulo: "Visão geral da fábrica", icone: "layout-grid", renderizar: paginaDashboard },
  maquinas: { titulo: "Máquinas", subtitulo: "Controle de equipamentos industriais", icone: "settings-2", renderizar: paginaMaquinas },
  producao: { titulo: "Produção", subtitulo: "Ordens e metas de produção", icone: "chart-no-axes-column-increasing", renderizar: paginaProducao },
  energia: { titulo: "Energia", subtitulo: "Monitoramento do consumo elétrico", icone: "zap", renderizar: paginaEnergia },
  sustentabilidade: { titulo: "Sustentabilidade", subtitulo: "Indicadores ambientais da fábrica", icone: "leaf", renderizar: paginaSustentabilidade },
  alertas: { titulo: "Alertas", subtitulo: "Ocorrências e avisos do sistema", icone: "bell", renderizar: paginaAlertas },
  funcionarios: { titulo: "Funcionários", subtitulo: "Equipe e controle de acesso", icone: "users", renderizar: paginaFuncionarios },
  relatorios: { titulo: "Relatórios", subtitulo: "Resumo e exportação de informações", icone: "file-text", renderizar: paginaRelatorios },
  configuracoes: { titulo: "Configurações", subtitulo: "Preferências gerais do sistema", icone: "settings", renderizar: paginaConfiguracoes }
};

function carregarDados() {
  try {
    const salvos = JSON.parse(localStorage.getItem("ecofactory_dados"));
    return salvos || structuredClone(dadosIniciais);
  } catch {
    return structuredClone(dadosIniciais);
  }
}

function salvarDados() {
  localStorage.setItem("ecofactory_dados", JSON.stringify(dados));
  atualizarContadores();
}

function textoStatus(status) {
  const textos = {
    online: "Online", atencao: "Atenção", parada: "Parada", manutencao: "Manutenção",
    em_andamento: "Em andamento", concluida: "Concluída", pausada: "Pausada", planejada: "Planejada",
    critico: "Crítico", informacao: "Informação"
  };
  return textos[status] || status;
}

function classeStatus(status) {
  if (["online", "concluida", "informacao"].includes(status)) return "verde";
  if (["atencao", "pausada", "planejada"].includes(status)) return "amarelo";
  if (["critico", "parada"].includes(status)) return "vermelho";
  return "azul";
}

function formatarNumero(numero) {
  return Number(numero).toLocaleString("pt-BR");
}

function proximoId(lista) {
  return lista.length ? Math.max(...lista.map(item => Number(item.id))) + 1 : 1;
}

function mostrarMensagem(texto, tipo = "sucesso") {
  const mensagem = document.querySelector("#mensagemFlutuante");
  mensagem.textContent = texto;
  mensagem.className = `mensagem-flutuante visivel ${tipo}`;
  setTimeout(() => mensagem.classList.remove("visivel"), 2600);
}

function abrirModal(titulo, conteudo) {
  document.querySelector("#modalTitulo").textContent = titulo;
  document.querySelector("#modalConteudo").innerHTML = conteudo;
  document.querySelector("#modalFundo").hidden = false;
  if (window.lucide) lucide.createIcons();
}

function fecharModal() {
  document.querySelector("#modalFundo").hidden = true;
}

function criarGrafico(valores, cor = "#2d8cff", maximo = null) {
  const largura = 700;
  const altura = 240;
  const topo = 18;
  const base = 205;
  const maior = maximo || Math.max(...valores) * 1.15;
  const pontos = valores.map((valor, indice) => {
    const x = 46 + (indice / (valores.length - 1)) * 630;
    const y = base - (valor / maior) * (base - topo);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const area = `${pontos.join(" ")} 676,${base} 46,${base}`;
  const grades = [0, 1, 2, 3, 4].map(indice => {
    const y = topo + indice * ((base - topo) / 4);
    const valor = Math.round(maior - indice * (maior / 4));
    return `<line class="linha-grade" x1="46" x2="676" y1="${y}" y2="${y}"></line><text class="rotulo-grafico" x="2" y="${y + 4}">${formatarNumero(valor)}</text>`;
  }).join("");

  return `<svg viewBox="0 0 ${largura} ${altura}" preserveAspectRatio="none">
    ${grades}
    <polygon class="area-grafico" points="${area}" fill="${cor}"></polygon>
    <polyline class="linha-grafico" points="${pontos.join(" ")}" stroke="${cor}"></polyline>
    <text class="rotulo-grafico" x="46" y="230">00:00</text><text class="rotulo-grafico" x="195" y="230">06:00</text>
    <text class="rotulo-grafico" x="355" y="230">12:00</text><text class="rotulo-grafico" x="515" y="230">18:00</text>
    <text class="rotulo-grafico" x="645" y="230">23:59</text>
  </svg>`;
}

function indicador(icone, cor, titulo, valor, unidade, detalhe) {
  return `<article class="cartao indicador">
    <i class="icone ${cor}" data-lucide="${icone}"></i>
    <div><span>${titulo}</span><strong>${valor}</strong><small>${unidade}</small><p class="${cor}">${detalhe}</p></div>
  </article>`;
}

function paginaDashboard() {
  const producaoTotal = dados.producoes.reduce((total, item) => total + Number(item.quantidade), 0);
  const ativas = dados.maquinas.filter(item => item.status === "online").length;
  const eficiencia = Math.round(dados.maquinas.reduce((total, item) => total + Number(item.eficiencia), 0) / dados.maquinas.length);

  return `
    <div class="barra-acoes"><span class="data-atual"><i data-lucide="calendar-days"></i>${new Date().toLocaleDateString("pt-BR")}</span></div>
    <section class="grade-indicadores">
      ${indicador("factory", "azul", "Produção (hoje)", formatarNumero(producaoTotal), "peças", "↑ 12,5% <em>vs ontem</em>")}
      ${indicador("cog", "verde", "Máquinas ativas", `${ativas} / ${dados.maquinas.length}`, "equipamentos", `${Math.round(ativas / dados.maquinas.length * 100)}% <em>operando</em>`)}
      ${indicador("zap", "amarelo", "Consumo de energia", "2.980", "kWh", "↓ 8,3% <em>vs ontem</em>")}
      ${indicador("leaf", "roxo", "Emissão de CO₂", "680", "kg CO₂", "↓ 15,4% <em>vs ontem</em>")}
      <article class="cartao eficiencia"><div><span>Eficiência da fábrica</span><p class="verde">↑ 6,7% <em>vs ontem</em></p></div><div class="medidor" style="--valor:${eficiencia * 3.6}deg"><span>${eficiencia}%</span></div></article>
    </section>
    <section class="grade-meio">
      <article class="cartao grafico-cartao"><div class="cartao-topo"><h2>Produção <span>(últimas 24h)</span></h2></div><div class="grafico">${criarGrafico(producao24h, "#2d8cff", 2000)}</div></article>
      <article class="cartao grafico-cartao"><div class="cartao-topo"><h2>Consumo de energia <span>(últimas 24h)</span></h2></div><div class="grafico">${criarGrafico(energia24h, "#55c84f", 4000)}</div></article>
      <article class="cartao maquinas-resumo"><div class="cartao-topo"><h2>Status das máquinas</h2><a href="#maquinas">Ver todas</a></div>
        ${dados.maquinas.slice(0, 5).map(item => `<div class="maquina-item"><i data-lucide="monitor-cog"></i><div class="maquina-nome"><strong>${item.nome}</strong><small class="${classeStatus(item.status)}">${textoStatus(item.status)}</small></div><span>${item.temperatura || "-"}°C</span><div class="barra"><span style="width:${item.eficiencia}%;background:var(--verde)"></span></div><span>${item.eficiencia}%</span></div>`).join("")}
      </article>
    </section>
    <section class="grade-inferior">
      <article class="cartao"><div class="cartao-topo"><h2>Alertas recentes</h2><a href="#alertas">Ver todos</a></div>
        ${dados.alertas.slice(0, 3).map(alerta => `<div class="alerta-item"><i class="${classeStatus(alerta.nivel)}" data-lucide="${alerta.resolvido ? "circle-check-big" : "triangle-alert"}"></i><div><strong>${alerta.titulo}</strong><small>${alerta.descricao}</small></div><time>${alerta.horario}</time></div>`).join("")}
      </article>
      <article class="cartao"><div class="cartao-topo"><h2>Produção por produto <span>(hoje)</span></h2><a href="#producao">Ver produção</a></div>
        ${dados.producoes.map((item, indice) => `<div class="produto-item"><span>${item.produto}</span><div class="barra"><span style="width:${Math.min(item.quantidade / item.meta * 100, 100)}%;background:${["#2d8cff", "#55c84f", "#ffbd19", "#8e45e8"][indice % 4]}"></span></div><b>${item.quantidade}</b><small>${Math.round(item.quantidade / item.meta * 100)}%</small></div>`).join("")}
      </article>
    </section>`;
}

function barraDePagina(textoBusca, textoBotao, acao) {
  return `<div class="barra-acoes">
    <label class="campo-busca"><i data-lucide="search"></i><input id="campoBusca" type="search" placeholder="${textoBusca}"></label>
    <button class="botao-primario" data-acao="${acao}"><i data-lucide="plus"></i>${textoBotao}</button>
  </div>`;
}

function paginaMaquinas() {
  return `${barraDePagina("Buscar máquina...", "Nova máquina", "nova-maquina")}
    <section class="resumo-cards">
      <div class="cartao resumo"><span>Total</span><strong>${dados.maquinas.length}</strong><i class="azul" data-lucide="settings-2"></i></div>
      <div class="cartao resumo"><span>Online</span><strong>${dados.maquinas.filter(m => m.status === "online").length}</strong><i class="verde" data-lucide="circle-check"></i></div>
      <div class="cartao resumo"><span>Atenção</span><strong>${dados.maquinas.filter(m => m.status === "atencao").length}</strong><i class="amarelo" data-lucide="triangle-alert"></i></div>
      <div class="cartao resumo"><span>Paradas</span><strong>${dados.maquinas.filter(m => m.status === "parada").length}</strong><i class="vermelho" data-lucide="circle-stop"></i></div>
    </section>
    <section class="cartao tabela-cartao"><div class="cartao-topo"><h2>Equipamentos cadastrados</h2></div>
      <div class="tabela-responsiva"><table><thead><tr><th>Código</th><th>Máquina</th><th>Localização</th><th>Status</th><th>Temperatura</th><th>Eficiência</th><th>Ações</th></tr></thead>
      <tbody>${dados.maquinas.map(m => `<tr data-busca="${m.codigo} ${m.nome} ${m.tipo}"><td>${m.codigo}</td><td><strong>${m.nome}</strong><small>${m.tipo}</small></td><td>${m.localizacao}</td><td><span class="etiqueta ${classeStatus(m.status)}">${textoStatus(m.status)}</span></td><td>${m.temperatura || "-"}°C</td><td><div class="progresso"><span style="width:${m.eficiencia}%"></span></div>${m.eficiencia}%</td><td class="acoes-tabela"><button data-acao="editar-maquina" data-id="${m.id}" title="Editar"><i data-lucide="pencil"></i></button><button data-acao="excluir-maquina" data-id="${m.id}" title="Excluir"><i data-lucide="trash-2"></i></button></td></tr>`).join("")}</tbody></table></div>
    </section>`;
}

function formularioMaquina(item = {}) {
  return `<form id="formMaquina" class="formulario" data-id="${item.id || ""}">
    <label>Código<input name="codigo" required value="${item.codigo || ""}" placeholder="Ex.: CNC-06"></label>
    <label>Nome<input name="nome" required value="${item.nome || ""}" placeholder="Nome da máquina"></label>
    <label>Tipo<input name="tipo" required value="${item.tipo || ""}" placeholder="Ex.: CNC"></label>
    <label>Localização<input name="localizacao" required value="${item.localizacao || ""}" placeholder="Ex.: Linha 3"></label>
    <label>Status<select name="status">${["online", "atencao", "parada", "manutencao"].map(s => `<option value="${s}" ${item.status === s ? "selected" : ""}>${textoStatus(s)}</option>`).join("")}</select></label>
    <label>Temperatura (°C)<input name="temperatura" type="number" min="0" value="${item.temperatura || 0}"></label>
    <label class="campo-inteiro">Eficiência: <output id="saidaEficiencia">${item.eficiencia || 0}%</output><input name="eficiencia" type="range" min="0" max="100" value="${item.eficiencia || 0}"></label>
    <div class="form-acoes campo-inteiro"><button type="button" class="botao-secundario" data-acao="fechar-modal">Cancelar</button><button class="botao-primario" type="submit">Salvar máquina</button></div>
  </form>`;
}

function paginaProducao() {
  const total = dados.producoes.reduce((soma, p) => soma + Number(p.quantidade), 0);
  const meta = dados.producoes.reduce((soma, p) => soma + Number(p.meta), 0);
  return `${barraDePagina("Buscar ordem ou produto...", "Nova ordem", "nova-producao")}
    <section class="resumo-cards">
      <div class="cartao resumo"><span>Produzido hoje</span><strong>${formatarNumero(total)}</strong><i class="azul" data-lucide="package-check"></i></div>
      <div class="cartao resumo"><span>Meta diária</span><strong>${formatarNumero(meta)}</strong><i class="verde" data-lucide="target"></i></div>
      <div class="cartao resumo"><span>Atingimento</span><strong>${Math.round(total / meta * 100)}%</strong><i class="amarelo" data-lucide="gauge"></i></div>
      <div class="cartao resumo"><span>Ordens abertas</span><strong>${dados.producoes.filter(p => p.status !== "concluida").length}</strong><i class="roxo" data-lucide="clipboard-list"></i></div>
    </section>
    <section class="cartao tabela-cartao"><div class="cartao-topo"><h2>Ordens de produção</h2></div><div class="tabela-responsiva"><table>
      <thead><tr><th>Ordem</th><th>Produto</th><th>Máquina</th><th>Progresso</th><th>Status</th><th>Data</th><th>Ações</th></tr></thead>
      <tbody>${dados.producoes.map(p => `<tr data-busca="${p.ordem} ${p.produto} ${p.maquina}"><td><strong>${p.ordem}</strong></td><td>${p.produto}</td><td>${p.maquina}</td><td><div class="progresso largo"><span style="width:${Math.min(p.quantidade / p.meta * 100, 100)}%"></span></div>${p.quantidade} / ${p.meta}</td><td><span class="etiqueta ${classeStatus(p.status)}">${textoStatus(p.status)}</span></td><td>${new Date(`${p.data}T12:00:00`).toLocaleDateString("pt-BR")}</td><td class="acoes-tabela"><button data-acao="editar-producao" data-id="${p.id}"><i data-lucide="pencil"></i></button><button data-acao="excluir-producao" data-id="${p.id}"><i data-lucide="trash-2"></i></button></td></tr>`).join("")}</tbody>
    </table></div></section>`;
}

function formularioProducao(item = {}) {
  return `<form id="formProducao" class="formulario" data-id="${item.id || ""}">
    <label>Ordem<input name="ordem" required value="${item.ordem || `OP-2026-${String(proximoId(dados.producoes)).padStart(3, "0")}`}"></label>
    <label>Produto<input name="produto" required value="${item.produto || ""}" placeholder="Produto"></label>
    <label>Máquina<select name="maquina">${dados.maquinas.map(m => `<option ${item.maquina === m.nome ? "selected" : ""}>${m.nome}</option>`).join("")}</select></label>
    <label>Status<select name="status">${["planejada", "em_andamento", "pausada", "concluida"].map(s => `<option value="${s}" ${item.status === s ? "selected" : ""}>${textoStatus(s)}</option>`).join("")}</select></label>
    <label>Quantidade produzida<input name="quantidade" type="number" min="0" required value="${item.quantidade || 0}"></label>
    <label>Meta<input name="meta" type="number" min="1" required value="${item.meta || 100}"></label>
    <label class="campo-inteiro">Data<input name="data" type="date" required value="${item.data || new Date().toISOString().slice(0, 10)}"></label>
    <div class="form-acoes campo-inteiro"><button type="button" class="botao-secundario" data-acao="fechar-modal">Cancelar</button><button class="botao-primario" type="submit">Salvar ordem</button></div>
  </form>`;
}

function paginaEnergia() {
  const media = Math.round(energia24h.reduce((a, b) => a + b, 0) / energia24h.length);
  return `<div class="barra-acoes"><select class="filtro-select"><option>Últimas 24 horas</option><option>Últimos 7 dias</option><option>Últimos 30 dias</option></select></div>
    <section class="resumo-cards">
      <div class="cartao resumo"><span>Consumo atual</span><strong>2.980 kWh</strong><i class="amarelo" data-lucide="zap"></i></div>
      <div class="cartao resumo"><span>Média por hora</span><strong>${formatarNumero(media)} kWh</strong><i class="azul" data-lucide="activity"></i></div>
      <div class="cartao resumo"><span>Economia mensal</span><strong>8,3%</strong><i class="verde" data-lucide="trending-down"></i></div>
      <div class="cartao resumo"><span>Custo estimado</span><strong>R$ 2.146</strong><i class="roxo" data-lucide="badge-dollar-sign"></i></div>
    </section>
    <section class="grade-detalhes">
      <article class="cartao grafico-grande"><div class="cartao-topo"><h2>Consumo energético por hora</h2></div><div class="grafico">${criarGrafico(energia24h, "#ffbd19", 4000)}</div></article>
      <article class="cartao"><div class="cartao-topo"><h2>Consumo por setor</h2></div><div class="lista-ranking">
        ${[["Linha de produção", 42, "#2d8cff"], ["Climatização", 24, "#55c84f"], ["Iluminação", 18, "#ffbd19"], ["Administrativo", 10, "#8e45e8"], ["Outros", 6, "#596574"]].map(i => `<div><span>${i[0]} <b>${i[1]}%</b></span><div class="barra"><span style="width:${i[1]}%;background:${i[2]}"></span></div></div>`).join("")}
      </div></article>
    </section>`;
}

function paginaSustentabilidade() {
  return `<section class="resumo-cards">
    <div class="cartao resumo"><span>Emissão de CO₂</span><strong>680 kg</strong><i class="roxo" data-lucide="cloud"></i></div>
    <div class="cartao resumo"><span>Água reutilizada</span><strong>72%</strong><i class="azul" data-lucide="droplets"></i></div>
    <div class="cartao resumo"><span>Resíduos reciclados</span><strong>86%</strong><i class="verde" data-lucide="recycle"></i></div>
    <div class="cartao resumo"><span>Energia renovável</span><strong>43%</strong><i class="amarelo" data-lucide="sun"></i></div>
  </section>
  <section class="grade-detalhes">
    <article class="cartao metas"><div class="cartao-topo"><h2>Metas ambientais</h2></div>
      ${[["Reduzir emissão de CO₂", 85, "680 de 800 kg"], ["Reutilização de água", 72, "Meta: 80%"], ["Reciclagem de resíduos", 86, "Meta: 90%"], ["Uso de energia renovável", 43, "Meta: 50%"]].map(m => `<div class="meta-item"><div><strong>${m[0]}</strong><span>${m[2]}</span></div><div class="progresso largo"><span style="width:${m[1]}%"></span></div><b>${m[1]}%</b></div>`).join("")}
    </article>
    <article class="cartao"><div class="cartao-topo"><h2>Impacto positivo no mês</h2></div><div class="impactos">
      <div><i class="verde" data-lucide="trees"></i><strong>124</strong><span>árvores equivalentes</span></div>
      <div><i class="azul" data-lucide="droplet"></i><strong>18.500 L</strong><span>de água economizados</span></div>
      <div><i class="amarelo" data-lucide="battery-charging"></i><strong>4.280 kWh</strong><span>de energia economizados</span></div>
    </div></article>
  </section>`;
}

function paginaAlertas() {
  return `${barraDePagina("Buscar alerta...", "Novo alerta", "novo-alerta")}
    <div class="filtros"><button class="filtro ativo" data-filtro="todos">Todos</button><button class="filtro" data-filtro="abertos">Em aberto</button><button class="filtro" data-filtro="resolvidos">Resolvidos</button></div>
    <section class="lista-alertas-completa">${dados.alertas.map(a => `<article class="cartao alerta-completo" data-busca="${a.titulo} ${a.descricao}" data-resolvido="${a.resolvido}">
      <div class="icone-alerta ${classeStatus(a.nivel)}"><i data-lucide="${a.resolvido ? "circle-check-big" : "triangle-alert"}"></i></div>
      <div><span class="etiqueta ${classeStatus(a.nivel)}">${textoStatus(a.nivel)}</span><h3>${a.titulo}</h3><p>${a.descricao}</p><small>Hoje às ${a.horario}</small></div>
      <div class="acoes-alerta">${!a.resolvido ? `<button class="botao-secundario" data-acao="resolver-alerta" data-id="${a.id}"><i data-lucide="check"></i>Resolver</button>` : `<span class="verde"><i data-lucide="check-circle"></i> Resolvido</span>`}<button class="botao-icone" data-acao="excluir-alerta" data-id="${a.id}"><i data-lucide="trash-2"></i></button></div>
    </article>`).join("")}</section>`;
}

function formularioAlerta() {
  return `<form id="formAlerta" class="formulario">
    <label class="campo-inteiro">Título<input name="titulo" required placeholder="Título da ocorrência"></label>
    <label>Nível<select name="nivel"><option value="informacao">Informação</option><option value="atencao">Atenção</option><option value="critico">Crítico</option></select></label>
    <label>Horário<input name="horario" type="time" required value="${new Date().toTimeString().slice(0, 5)}"></label>
    <label class="campo-inteiro">Descrição<textarea name="descricao" required placeholder="Descreva o que aconteceu"></textarea></label>
    <div class="form-acoes campo-inteiro"><button type="button" class="botao-secundario" data-acao="fechar-modal">Cancelar</button><button class="botao-primario" type="submit">Registrar alerta</button></div>
  </form>`;
}

function paginaFuncionarios() {
  return `${barraDePagina("Buscar funcionário...", "Novo funcionário", "novo-funcionario")}
    <section class="cartao tabela-cartao"><div class="cartao-topo"><h2>Equipe EcoFactory</h2><span>${dados.funcionarios.filter(f => f.ativo).length} ativos</span></div><div class="tabela-responsiva"><table>
      <thead><tr><th>Funcionário</th><th>Matrícula</th><th>Cargo</th><th>Turno</th><th>Status</th><th>Ações</th></tr></thead>
      <tbody>${dados.funcionarios.map(f => `<tr data-busca="${f.nome} ${f.matricula} ${f.cargo}"><td><div class="pessoa"><span>${f.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}</span><div><strong>${f.nome}</strong><small>${f.email}</small></div></div></td><td>${f.matricula}</td><td>${f.cargo}</td><td>${f.turno}</td><td><span class="etiqueta ${f.ativo ? "verde" : "vermelho"}">${f.ativo ? "Ativo" : "Inativo"}</span></td><td class="acoes-tabela"><button data-acao="editar-funcionario" data-id="${f.id}"><i data-lucide="pencil"></i></button><button data-acao="excluir-funcionario" data-id="${f.id}"><i data-lucide="trash-2"></i></button></td></tr>`).join("")}</tbody>
    </table></div></section>`;
}

function formularioFuncionario(item = {}) {
  return `<form id="formFuncionario" class="formulario" data-id="${item.id || ""}">
    <label>Nome<input name="nome" required value="${item.nome || ""}"></label>
    <label>Matrícula<input name="matricula" required value="${item.matricula || `FUN-${String(proximoId(dados.funcionarios)).padStart(3, "0")}`}"></label>
    <label>Cargo<input name="cargo" required value="${item.cargo || ""}"></label>
    <label>E-mail<input name="email" type="email" required value="${item.email || ""}"></label>
    <label>Turno<select name="turno">${["Comercial", "Manhã", "Tarde", "Noite"].map(t => `<option ${item.turno === t ? "selected" : ""}>${t}</option>`).join("")}</select></label>
    <label class="campo-check"><input name="ativo" type="checkbox" ${item.ativo !== false ? "checked" : ""}> Funcionário ativo</label>
    <div class="form-acoes campo-inteiro"><button type="button" class="botao-secundario" data-acao="fechar-modal">Cancelar</button><button class="botao-primario" type="submit">Salvar funcionário</button></div>
  </form>`;
}

function paginaRelatorios() {
  const relatorios = [
    ["Produção diária", "Resumo das ordens e quantidades produzidas", "producao", "chart-column"],
    ["Máquinas e eficiência", "Situação atual de todos os equipamentos", "maquinas", "settings-2"],
    ["Alertas e ocorrências", "Histórico de alertas registrados", "alertas", "triangle-alert"],
    ["Equipe de funcionários", "Lista dos colaboradores cadastrados", "funcionarios", "users"]
  ];
  return `<section class="grade-relatorios">${relatorios.map(r => `<article class="cartao relatorio-card"><i data-lucide="${r[3]}"></i><div><h2>${r[0]}</h2><p>${r[1]}</p><small>Atualizado agora</small></div><button class="botao-primario" data-acao="exportar" data-tipo="${r[2]}"><i data-lucide="download"></i>Exportar CSV</button></article>`).join("")}</section>
    <section class="cartao relatorio-resumo"><div class="cartao-topo"><h2>Resumo geral</h2><button class="botao-secundario" onclick="window.print()"><i data-lucide="printer"></i>Imprimir página</button></div>
      <div class="resumo-impressao"><h3>${dados.configuracoes.fabrica}</h3><p>Relatório gerado em ${new Date().toLocaleString("pt-BR")}</p>
      <ul><li>${dados.maquinas.length} máquinas cadastradas</li><li>${dados.producoes.length} ordens de produção</li><li>${dados.alertas.filter(a => !a.resolvido).length} alertas em aberto</li><li>${dados.funcionarios.filter(f => f.ativo).length} funcionários ativos</li></ul></div>
    </section>`;
}

function paginaConfiguracoes() {
  const c = dados.configuracoes;
  return `<form id="formConfiguracoes">
    <section class="grade-configuracoes">
      <article class="cartao configuracao-card"><div class="cartao-topo"><h2><i data-lucide="factory"></i> Dados da fábrica</h2></div><div class="formulario uma-coluna">
        <label>Nome da fábrica<input name="fabrica" required value="${c.fabrica}"></label>
        <label>E-mail de contato<input name="email" type="email" required value="${c.email}"></label>
      </div></article>
      <article class="cartao configuracao-card"><div class="cartao-topo"><h2><i data-lucide="target"></i> Metas</h2></div><div class="formulario uma-coluna">
        <label>Limite diário de energia (kWh)<input name="metaEnergia" type="number" min="1" value="${c.metaEnergia}"></label>
        <label>Limite diário de CO₂ (kg)<input name="metaCo2" type="number" min="1" value="${c.metaCo2}"></label>
      </div></article>
      <article class="cartao configuracao-card"><div class="cartao-topo"><h2><i data-lucide="bell"></i> Notificações</h2></div><div class="opcao-config"><div><strong>Notificações do sistema</strong><p>Mostrar avisos de novas ocorrências</p></div><label class="interruptor"><input name="notificacoes" type="checkbox" ${c.notificacoes ? "checked" : ""}><span></span></label></div></article>
      <article class="cartao configuracao-card"><div class="cartao-topo"><h2><i data-lucide="database-backup"></i> Dados locais</h2></div><div class="config-acoes"><p>Os cadastros estão salvos neste navegador.</p><button type="button" class="botao-perigo" data-acao="restaurar-dados"><i data-lucide="rotate-ccw"></i>Restaurar dados iniciais</button></div></article>
    </section>
    <div class="salvar-config"><button class="botao-primario" type="submit"><i data-lucide="save"></i>Salvar configurações</button></div>
  </form>`;
}

function navegar(pagina) {
  paginaAtual = paginas[pagina] ? pagina : "dashboard";
  const configuracao = paginas[paginaAtual];
  document.querySelector("#tituloPagina").textContent = configuracao.titulo;
  document.querySelector("#subtituloPagina").textContent = configuracao.subtitulo;
  document.querySelector("#iconePagina").setAttribute("data-lucide", configuracao.icone);
  document.querySelector("#conteudoPagina").innerHTML = configuracao.renderizar();
  document.querySelectorAll(".menu-item").forEach(item => item.classList.toggle("ativo", item.dataset.pagina === paginaAtual));
  document.title = `EcoFactory | ${configuracao.titulo}`;
  configurarEventosDaPagina();
  atualizarContadores();
  fecharMenuMovel();
  if (window.lucide) lucide.createIcons();
}

function configurarEventosDaPagina() {
  const busca = document.querySelector("#campoBusca");
  if (busca) busca.addEventListener("input", () => {
    const termo = busca.value.toLowerCase();
    document.querySelectorAll("[data-busca]").forEach(item => {
      item.hidden = !item.dataset.busca.toLowerCase().includes(termo);
    });
  });

  document.querySelectorAll("[data-filtro]").forEach(botao => botao.addEventListener("click", () => {
    document.querySelectorAll("[data-filtro]").forEach(b => b.classList.remove("ativo"));
    botao.classList.add("ativo");
    document.querySelectorAll("[data-resolvido]").forEach(item => {
      item.hidden = botao.dataset.filtro === "abertos" ? item.dataset.resolvido === "true" : botao.dataset.filtro === "resolvidos" ? item.dataset.resolvido === "false" : false;
    });
  }));

  const configuracoes = document.querySelector("#formConfiguracoes");
  if (configuracoes) configuracoes.addEventListener("submit", salvarConfiguracoes);
}

function tratarAcao(acao, id, elemento) {
  const numeroId = Number(id);
  if (acao === "nova-maquina") abrirModal("Cadastrar máquina", formularioMaquina());
  if (acao === "editar-maquina") abrirModal("Editar máquina", formularioMaquina(dados.maquinas.find(i => i.id === numeroId)));
  if (acao === "excluir-maquina") excluirItem("maquinas", numeroId, "máquina");
  if (acao === "nova-producao") abrirModal("Nova ordem de produção", formularioProducao());
  if (acao === "editar-producao") abrirModal("Editar ordem", formularioProducao(dados.producoes.find(i => i.id === numeroId)));
  if (acao === "excluir-producao") excluirItem("producoes", numeroId, "ordem");
  if (acao === "novo-alerta") abrirModal("Registrar alerta", formularioAlerta());
  if (acao === "resolver-alerta") resolverAlerta(numeroId);
  if (acao === "excluir-alerta") excluirItem("alertas", numeroId, "alerta");
  if (acao === "novo-funcionario") abrirModal("Cadastrar funcionário", formularioFuncionario());
  if (acao === "editar-funcionario") abrirModal("Editar funcionário", formularioFuncionario(dados.funcionarios.find(i => i.id === numeroId)));
  if (acao === "excluir-funcionario") excluirItem("funcionarios", numeroId, "funcionário");
  if (acao === "fechar-modal") fecharModal();
  if (acao === "exportar") exportarCSV(elemento.dataset.tipo);
  if (acao === "restaurar-dados") restaurarDados();
}

function excluirItem(lista, id, nome) {
  if (!confirm(`Deseja realmente excluir este ${nome}?`)) return;
  dados[lista] = dados[lista].filter(item => item.id !== id);
  salvarDados();
  navegar(paginaAtual);
  mostrarMensagem(`${nome[0].toUpperCase() + nome.slice(1)} excluído com sucesso.`);
}

function resolverAlerta(id) {
  const alerta = dados.alertas.find(item => item.id === id);
  alerta.resolvido = true;
  salvarDados();
  navegar("alertas");
  mostrarMensagem("Alerta marcado como resolvido.");
}

function salvarMaquina(formulario) {
  const valores = Object.fromEntries(new FormData(formulario));
  const id = Number(formulario.dataset.id);
  const maquina = { id: id || proximoId(dados.maquinas), ...valores, temperatura: Number(valores.temperatura), eficiencia: Number(valores.eficiencia) };
  if (id) dados.maquinas[dados.maquinas.findIndex(item => item.id === id)] = maquina;
  else dados.maquinas.push(maquina);
  concluirFormulario("Máquina salva com sucesso.");
}

function salvarProducao(formulario) {
  const valores = Object.fromEntries(new FormData(formulario));
  const id = Number(formulario.dataset.id);
  const producao = { id: id || proximoId(dados.producoes), ...valores, quantidade: Number(valores.quantidade), meta: Number(valores.meta) };
  if (id) dados.producoes[dados.producoes.findIndex(item => item.id === id)] = producao;
  else dados.producoes.push(producao);
  concluirFormulario("Ordem de produção salva.");
}

function salvarFuncionario(formulario) {
  const valores = Object.fromEntries(new FormData(formulario));
  const id = Number(formulario.dataset.id);
  const funcionario = { id: id || proximoId(dados.funcionarios), ...valores, ativo: formulario.ativo.checked };
  if (id) dados.funcionarios[dados.funcionarios.findIndex(item => item.id === id)] = funcionario;
  else dados.funcionarios.push(funcionario);
  concluirFormulario("Funcionário salvo com sucesso.");
}

function salvarAlerta(formulario) {
  const valores = Object.fromEntries(new FormData(formulario));
  dados.alertas.unshift({ id: proximoId(dados.alertas), ...valores, resolvido: false });
  concluirFormulario("Alerta registrado com sucesso.");
}

function concluirFormulario(mensagem) {
  salvarDados();
  fecharModal();
  navegar(paginaAtual);
  mostrarMensagem(mensagem);
}

function salvarConfiguracoes(evento) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  const valores = Object.fromEntries(new FormData(formulario));
  dados.configuracoes = { ...valores, metaEnergia: Number(valores.metaEnergia), metaCo2: Number(valores.metaCo2), notificacoes: formulario.notificacoes.checked };
  salvarDados();
  mostrarMensagem("Configurações salvas.");
}

function restaurarDados() {
  if (!confirm("Todos os cadastros feitos neste navegador serão apagados. Continuar?")) return;
  dados = structuredClone(dadosIniciais);
  salvarDados();
  navegar("configuracoes");
  mostrarMensagem("Dados iniciais restaurados.");
}

function exportarCSV(tipo) {
  const lista = dados[tipo];
  if (!lista?.length) return mostrarMensagem("Não existem dados para exportar.", "erro");
  const colunas = Object.keys(lista[0]);
  const limpar = valor => `"${String(valor).replaceAll('"', '""')}"`;
  const csv = [colunas.join(";"), ...lista.map(item => colunas.map(c => limpar(item[c])).join(";"))].join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
  link.download = `ecofactory-${tipo}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  mostrarMensagem("Relatório exportado.");
}

function atualizarContadores() {
  const abertos = dados.alertas.filter(item => !item.resolvido).length;
  document.querySelector("#contadorAlertas").textContent = abertos;
  document.querySelector("#notificacoesTopo").textContent = abertos;
}

function fecharMenuMovel() {
  document.querySelector("#barraLateral").classList.remove("aberta");
  document.querySelector("#fundoMenu").classList.remove("ativo");
}

function iniciarPainel() {
  document.querySelector("#botaoMenu").addEventListener("click", () => {
    document.querySelector("#barraLateral").classList.toggle("aberta");
    document.querySelector("#fundoMenu").classList.toggle("ativo");
  });
  document.querySelector("#fundoMenu").addEventListener("click", fecharMenuMovel);
  document.querySelector("#fecharModal").addEventListener("click", fecharModal);
  document.querySelector("#modalFundo").addEventListener("click", evento => {
    if (evento.target.id === "modalFundo") fecharModal();
  });
  document.querySelector("#botaoNotificacoes").addEventListener("click", () => location.hash = "alertas");
  document.querySelector("#botaoSair").addEventListener("click", () => mostrarMensagem("Sessão local encerrada. Esta tela é apenas demonstrativa."));

  document.addEventListener("click", evento => {
    const elemento = evento.target.closest("[data-acao]");
    if (elemento) tratarAcao(elemento.dataset.acao, elemento.dataset.id, elemento);
  });
  document.addEventListener("input", evento => {
    if (evento.target.name === "eficiencia") document.querySelector("#saidaEficiencia").value = `${evento.target.value}%`;
  });
  document.addEventListener("submit", evento => {
    if (evento.target.id === "formMaquina") { evento.preventDefault(); salvarMaquina(evento.target); }
    if (evento.target.id === "formProducao") { evento.preventDefault(); salvarProducao(evento.target); }
    if (evento.target.id === "formFuncionario") { evento.preventDefault(); salvarFuncionario(evento.target); }
    if (evento.target.id === "formAlerta") { evento.preventDefault(); salvarAlerta(evento.target); }
  });

  window.addEventListener("hashchange", () => navegar(location.hash.slice(1)));
  navegar(location.hash.slice(1) || "dashboard");
}

document.addEventListener("DOMContentLoaded", iniciarPainel);
