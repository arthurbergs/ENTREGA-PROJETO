const banco = require("../configuracao/banco");

const statusPermitidos = ["online", "atencao", "parada", "manutencao"];

async function listarMaquinas(req, res, next) {
  try {
    const resultado = await banco.query(
      `SELECT id, codigo, nome, tipo, localizacao, status,
              temperatura_maxima_c, ativa, criado_em, atualizado_em
       FROM maquinas
       ORDER BY id`
    );

    return res.status(200).json(resultado.rows);
  } catch (erro) {
    return next(erro);
  }
}

async function buscarMaquina(req, res, next) {
  try {
    const resultado = await banco.query(
      `SELECT id, codigo, nome, tipo, localizacao, status,
              temperatura_maxima_c, ativa, criado_em, atualizado_em
       FROM maquinas
       WHERE id = $1`,
      [req.params.id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: "Máquina não encontrada." });
    }

    return res.status(200).json(resultado.rows[0]);
  } catch (erro) {
    return next(erro);
  }
}

async function criarMaquina(req, res, next) {
  const {
    codigo,
    nome,
    tipo,
    localizacao = null,
    status = "parada",
    temperatura_maxima_c = null,
    ativa = true
  } = req.body;

  if (!codigo || !nome || !tipo) {
    return res.status(400).json({
      mensagem: "Os campos código, nome e tipo são obrigatórios."
    });
  }

  if (!statusPermitidos.includes(status)) {
    return res.status(400).json({ mensagem: "O status informado é inválido." });
  }

  try {
    const resultado = await banco.query(
      `INSERT INTO maquinas
        (codigo, nome, tipo, localizacao, status, temperatura_maxima_c, ativa)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [codigo, nome, tipo, localizacao, status, temperatura_maxima_c, ativa]
    );

    return res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    return next(erro);
  }
}

async function atualizarMaquina(req, res, next) {
  const {
    codigo,
    nome,
    tipo,
    localizacao = null,
    status,
    temperatura_maxima_c = null,
    ativa = true
  } = req.body;

  if (!codigo || !nome || !tipo || !status) {
    return res.status(400).json({
      mensagem: "Código, nome, tipo e status são obrigatórios."
    });
  }

  if (!statusPermitidos.includes(status)) {
    return res.status(400).json({ mensagem: "O status informado é inválido." });
  }

  try {
    const resultado = await banco.query(
      `UPDATE maquinas
       SET codigo = $1, nome = $2, tipo = $3, localizacao = $4,
           status = $5, temperatura_maxima_c = $6, ativa = $7
       WHERE id = $8
       RETURNING *`,
      [
        codigo,
        nome,
        tipo,
        localizacao,
        status,
        temperatura_maxima_c,
        ativa,
        req.params.id
      ]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: "Máquina não encontrada." });
    }

    return res.status(200).json(resultado.rows[0]);
  } catch (erro) {
    return next(erro);
  }
}

async function excluirMaquina(req, res, next) {
  try {
    const resultado = await banco.query(
      "DELETE FROM maquinas WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (resultado.rowCount === 0) {
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
