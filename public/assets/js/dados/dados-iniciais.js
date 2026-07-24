export const dadosIniciais = {
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
  configuracoes: {
    fabrica: "EcoFactory",
    email: "contato@ecofactory.local",
    metaEnergia: 3200,
    metaCo2: 800,
    notificacoes: true
  }
};

export const producao24h = [
  430, 520, 710, 820, 1000, 1050, 1010, 1190, 1400, 1160, 1210, 930,
  900, 920, 1010, 1160, 1080, 1130, 1090, 1420, 1600, 1280, 1550, 1710
];

export const energia24h = [
  1450, 1570, 1900, 1980, 1780, 1910, 2550, 2590, 2450, 2700, 2410,
  2120, 2470, 2600, 2950, 2550, 2740, 2450, 2850, 2670, 2900, 3000
];
