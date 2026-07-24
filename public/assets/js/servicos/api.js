const API_URL = "/api";

export const modoHospedado = location.hostname.endsWith(".chatgpt.site");

export async function requisitarAPI(caminho, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    headers: {
      "Content-Type": "application/json",
      ...opcoes.headers
    },
    ...opcoes
  });

  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => ({}));
    throw new Error(corpo.mensagem || `Erro ${resposta.status} ao acessar a API.`);
  }

  return resposta.status === 204 ? null : resposta.json();
}
