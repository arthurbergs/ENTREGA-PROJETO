const banco = require("../configuracao/banco");

async function listarProdutos(req, res, next) {
  try {
    const resultado = await banco.query(
      `SELECT id, codigo, nome, descricao, unidade, ativo,
              criado_em, atualizado_em
       FROM produtos
       ORDER BY id`
    );

    return res.status(200).json(resultado.rows);
  } catch (erro) {
    return next(erro);
  }
}

async function buscarProduto(req, res, next) {
  try {
    const resultado = await banco.query(
      "SELECT * FROM produtos WHERE id = $1",
      [req.params.id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: "Produto não encontrado." });
    }

    return res.status(200).json(resultado.rows[0]);
  } catch (erro) {
    return next(erro);
  }
}

async function criarProduto(req, res, next) {
  const {
    codigo,
    nome,
    descricao = null,
    unidade = "peca",
    ativo = true
  } = req.body;

  if (!codigo || !nome) {
    return res.status(400).json({
      mensagem: "Os campos código e nome são obrigatórios."
    });
  }

  try {
    const resultado = await banco.query(
      `INSERT INTO produtos (codigo, nome, descricao, unidade, ativo)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [codigo, nome, descricao, unidade, ativo]
    );

    return res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    return next(erro);
  }
}

async function atualizarProduto(req, res, next) {
  const {
    codigo,
    nome,
    descricao = null,
    unidade = "peca",
    ativo = true
  } = req.body;

  if (!codigo || !nome) {
    return res.status(400).json({
      mensagem: "Os campos código e nome são obrigatórios."
    });
  }

  try {
    const resultado = await banco.query(
      `UPDATE produtos
       SET codigo = $1, nome = $2, descricao = $3, unidade = $4, ativo = $5
       WHERE id = $6
       RETURNING *`,
      [codigo, nome, descricao, unidade, ativo, req.params.id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: "Produto não encontrado." });
    }

    return res.status(200).json(resultado.rows[0]);
  } catch (erro) {
    return next(erro);
  }
}

async function excluirProduto(req, res, next) {
  try {
    const resultado = await banco.query(
      "DELETE FROM produtos WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: "Produto não encontrado." });
    }

    return res.status(204).send();
  } catch (erro) {
    return next(erro);
  }
}

module.exports = {
  listarProdutos,
  buscarProduto,
  criarProduto,
  atualizarProduto,
  excluirProduto
};
