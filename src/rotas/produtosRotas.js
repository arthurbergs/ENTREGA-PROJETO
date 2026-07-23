const express = require("express");
const produtosControlador = require("../controladores/produtosControlador");

const rotas = express.Router();

rotas.get("/", produtosControlador.listarProdutos);
rotas.get("/:id", produtosControlador.buscarProduto);
rotas.post("/", produtosControlador.criarProduto);
rotas.put("/:id", produtosControlador.atualizarProduto);
rotas.delete("/:id", produtosControlador.excluirProduto);

module.exports = rotas;
