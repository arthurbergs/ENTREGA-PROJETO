const maquinasIniciais = [
  { id: 1, codigo: "CNC-01", nome: "CNC 01", tipo: "CNC", localizacao: "Linha 1", status: "online", temperatura: 42, eficiencia: 75, ativa: true },
  { id: 2, codigo: "PRENSA-02", nome: "Prensa 02", tipo: "Prensa", localizacao: "Linha 1", status: "atencao", temperatura: 65, eficiencia: 60, ativa: true },
  { id: 3, codigo: "SOLDA-03", nome: "Solda 03", tipo: "Solda", localizacao: "Linha 2", status: "online", temperatura: 38, eficiencia: 90, ativa: true },
  { id: 4, codigo: "PINTURA-04", nome: "Pintura 04", tipo: "Pintura", localizacao: "Linha 2", status: "parada", temperatura: 0, eficiencia: 0, ativa: true },
  { id: 5, codigo: "CNC-05", nome: "CNC 05", tipo: "CNC", localizacao: "Linha 3", status: "online", temperatura: 45, eficiencia: 80, ativa: true }
];

const produtosIniciais = [
  { id: 1, codigo: "PROD-A", nome: "Produto A", unidade: "peca", ativo: true },
  { id: 2, codigo: "PROD-B", nome: "Produto B", unidade: "peca", ativo: true },
  { id: 3, codigo: "PROD-C", nome: "Produto C", unidade: "peca", ativo: true },
  { id: 4, codigo: "PROD-D", nome: "Produto D", unidade: "peca", ativo: true }
];

const estado = globalThis.__ecofactoryEstado || {
  maquinas: structuredClone(maquinasIniciais),
  produtos: structuredClone(produtosIniciais)
};

globalThis.__ecofactoryEstado = estado;

export default estado;
