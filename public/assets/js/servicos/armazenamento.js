import { dadosIniciais } from "../dados/dados-iniciais.js";

const CHAVE_DADOS = "ecofactory_dados";

export function carregarDadosLocais() {
  try {
    const dadosSalvos = JSON.parse(localStorage.getItem(CHAVE_DADOS));
    return dadosSalvos || structuredClone(dadosIniciais);
  } catch {
    return structuredClone(dadosIniciais);
  }
}

export function salvarDadosLocais(dados) {
  localStorage.setItem(CHAVE_DADOS, JSON.stringify(dados));
}
