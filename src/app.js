const express = require("express");
const cors = require("cors");
const path = require("path");
const maquinasRotas = require("./rotas/maquinasRotas");
const produtosRotas = require("./rotas/produtosRotas");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

app.get("/api", (req, res) => {
  return res.status(200).json({
    mensagem: "API EcoFactory funcionando!",
    versao: "2.0.0",
    banco: "MySQL"
  });
});

app.use("/api/maquinas", maquinasRotas);
app.use("/api/produtos", produtosRotas);

app.use((req, res) => {
  return res.status(404).json({ mensagem: "Rota não encontrada." });
});

app.use((erro, req, res, next) => {
  console.error(erro);

  if (["ER_ACCESS_DENIED_ERROR", "ECONNREFUSED", "PROTOCOL_CONNECTION_LOST"].includes(erro.code)) {
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
    return res.status(400).json({ mensagem: "Foi informado um valor inválido." });
  }

  return res.status(500).json({
    mensagem: "Ocorreu um erro interno no servidor."
  });
});

module.exports = app;
