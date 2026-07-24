const textosStatus = {
  online: "Online",
  atencao: "Atenção",
  parada: "Parada",
  manutencao: "Manutenção",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  pausada: "Pausada",
  planejada: "Planejada",
  critico: "Crítico",
  informacao: "Informação"
};

export function textoStatus(status) {
  return textosStatus[status] || status;
}

export function classeStatus(status) {
  if (["online", "concluida", "informacao"].includes(status)) return "verde";
  if (["atencao", "pausada", "planejada"].includes(status)) return "amarelo";
  if (["critico", "parada"].includes(status)) return "vermelho";
  return "azul";
}

export function formatarNumero(numero) {
  return Number(numero).toLocaleString("pt-BR");
}

export function proximoId(lista) {
  return lista.length ? Math.max(...lista.map(item => Number(item.id))) + 1 : 1;
}
