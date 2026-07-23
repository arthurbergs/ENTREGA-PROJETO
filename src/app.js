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
    versao: "1.0.0"
  });
});

app.use("/api/maquinas", maquinasRotas);
app.use("/api/produtos", produtosRotas);

app.use((req, res) => {
  return res.status(404).json({ mensagem: "Rota não encontrada." });
});

app.use((erro, req, res, next) => {
  console.error(erro);

  if (erro.code === "23505") {
    return res.status(409).json({
      mensagem: "Já existe um cadastro com esse código."
    });
  }

  if (erro.code === "23503") {
    return res.status(409).json({
      mensagem: "O registro não pode ser excluído porque está sendo utilizado."
    });
  }

  if (erro.code === "22P02") {
    return res.status(400).json({ mensagem: "Foi informado um valor inválido." });
  }

  return res.status(500).json({
    mensagem: "Ocorreu um erro interno no servidor."
  });
});

module.exports = app;
