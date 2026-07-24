const express = require("express");
const cors = require("cors");
const path = require("path");
const maquinasRotas = require("./rotas/maquinasRotas");
const produtosRotas = require("./rotas/produtosRotas");
const {
  rotaNaoEncontrada,
  tratamentoErros
} = require("./middlewares/tratamentoErros");

const app = express();
const diretorioPublico = path.resolve(__dirname, "..", "..", "public");

app.use(cors());
app.use(express.json());
app.use(express.static(diretorioPublico));

app.get("/api", (req, res) => {
  return res.status(200).json({
    mensagem: "API EcoFactory funcionando!",
    versao: "2.0.0",
    banco: "MySQL"
  });
});

app.use("/api/maquinas", maquinasRotas);
app.use("/api/produtos", produtosRotas);

app.use(rotaNaoEncontrada);
app.use(tratamentoErros);

module.exports = app;
