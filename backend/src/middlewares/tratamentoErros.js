const codigosBancoIndisponivel = [
  "ER_ACCESS_DENIED_ERROR",
  "ECONNREFUSED",
  "PROTOCOL_CONNECTION_LOST"
];

function rotaNaoEncontrada(req, res) {
  return res.status(404).json({ mensagem: "Rota não encontrada." });
}

function tratamentoErros(erro, req, res, next) {
  console.error(erro);

  if (codigosBancoIndisponivel.includes(erro.code)) {
    return res.status(503).json({
      mensagem: "Banco MySQL indisponível. Verifique as configurações do arquivo .env."
    });
  }

  if (erro.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      mensagem: "Já existe um cadastro com esse código."
    });
  }

  if (erro.code === "ER_ROW_IS_REFERENCED_2") {
    return res.status(409).json({
      mensagem: "O registro não pode ser excluído porque está sendo utilizado."
    });
  }

  if (["ER_TRUNCATED_WRONG_VALUE", "ER_DATA_TOO_LONG"].includes(erro.code)) {
    return res.status(400).json({
      mensagem: "Foi informado um valor inválido."
    });
  }

  return res.status(500).json({
    mensagem: "Ocorreu um erro interno no servidor."
  });
}

module.exports = {
  rotaNaoEncontrada,
  tratamentoErros
};
