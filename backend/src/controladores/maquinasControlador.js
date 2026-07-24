const maquinasRepositorio = require("../repositorios/maquinasRepositorio");

const statusPermitidos = ["online", "atencao", "parada", "manutencao"];

function validarMaquina(dados) {
  if (!dados.codigo || !dados.nome || !dados.tipo) {
    return "Código, nome e tipo são obrigatórios.";
  }

  if (!statusPermitidos.includes(dados.status || "parada")) {
    return "O status informado é inválido.";
  }

  return null;
}

function normalizarMaquina(dados) {
  return {
    codigo: dados.codigo,
    nome: dados.nome,
    tipo: dados.tipo,
    localizacao: dados.localizacao || null,
    status: dados.status || "parada",
    temperatura_maxima_c: dados.temperatura_maxima_c || null,
    ativa: dados.ativa ?? true,
    temperatura: Number(dados.temperatura || 0),
    eficiencia: Number(dados.eficiencia || 0)
  };
}

async function listarMaquinas(req, res, next) {
  try {
    const maquinas = await maquinasRepositorio.listar();
    return res.status(200).json(maquinas);
  } catch (erro) {
    return next(erro);
  }
}

async function buscarMaquina(req, res, next) {
  try {
    const maquina = await maquinasRepositorio.buscarPorId(req.params.id);

    if (!maquina) {
      return res.status(404).json({ mensagem: "Máquina não encontrada." });
    }

    return res.status(200).json(maquina);
  } catch (erro) {
    return next(erro);
  }
}

async function criarMaquina(req, res, next) {
  const mensagem = validarMaquina(req.body);

  if (mensagem) {
    return res.status(400).json({ mensagem });
  }

  try {
    const maquina = await maquinasRepositorio.criar(
      normalizarMaquina(req.body)
    );
    return res.status(201).json(maquina);
  } catch (erro) {
    return next(erro);
  }
}

async function atualizarMaquina(req, res, next) {
  const mensagem = validarMaquina(req.body);

  if (mensagem) {
    return res.status(400).json({ mensagem });
  }

  try {
    const maquina = await maquinasRepositorio.atualizar(
      req.params.id,
      normalizarMaquina(req.body)
    );

    if (!maquina) {
      return res.status(404).json({ mensagem: "Máquina não encontrada." });
    }

    return res.status(200).json(maquina);
  } catch (erro) {
    return next(erro);
  }
}

async function excluirMaquina(req, res, next) {
  try {
    const excluida = await maquinasRepositorio.excluir(req.params.id);

    if (!excluida) {
      return res.status(404).json({ mensagem: "Máquina não encontrada." });
    }

    return res.status(204).send();
  } catch (erro) {
    return next(erro);
  }
}

module.exports = {
  listarMaquinas,
  buscarMaquina,
  criarMaquina,
  atualizarMaquina,
  excluirMaquina
};
