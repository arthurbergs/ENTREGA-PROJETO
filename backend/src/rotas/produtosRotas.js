const express = require("express");
const {
  listarProdutos,
  buscarProduto,
  criarProduto,
  atualizarProduto,
  excluirProduto
} = require("../controladores/produtosControlador");

const rotas = express.Router();

rotas.get("/", listarProdutos);
rotas.get("/:id", buscarProduto);
rotas.post("/", criarProduto);
rotas.put("/:id", atualizarProduto);
rotas.delete("/:id", excluirProduto);

module.exports = rotas;
