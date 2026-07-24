const express = require("express");
const {
  listarMaquinas,
  buscarMaquina,
  criarMaquina,
  atualizarMaquina,
  excluirMaquina
} = require("../controladores/maquinasControlador");

const rotas = express.Router();

rotas.get("/", listarMaquinas);
rotas.get("/:id", buscarMaquina);
rotas.post("/", criarMaquina);
rotas.put("/:id", atualizarMaquina);
rotas.delete("/:id", excluirMaquina);

module.exports = rotas;
