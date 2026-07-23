const express = require("express");
const maquinasControlador = require("../controladores/maquinasControlador");

const rotas = express.Router();

rotas.get("/", maquinasControlador.listarMaquinas);
rotas.get("/:id", maquinasControlador.buscarMaquina);
rotas.post("/", maquinasControlador.criarMaquina);
rotas.put("/:id", maquinasControlador.atualizarMaquina);
rotas.delete("/:id", maquinasControlador.excluirMaquina);

module.exports = rotas;
