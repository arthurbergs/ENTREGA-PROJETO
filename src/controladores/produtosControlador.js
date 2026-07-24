const banco = require("../configuracao/banco");

async function obterProduto(id) {
  const [linhas] = await banco.query("SELECT * FROM produtos WHERE id = ?", [id]);
  return linhas[0];
}

async function listarProdutos(req, res, next) {
  try {
    const [linhas] = await banco.query(
      `SELECT id, codigo, nome, descricao, unidade, ativo, criado_em, atualizado_em
       FROM produtos ORDER BY id`
    );
    return res.status(200).json(linhas);
  } catch (erro) { return next(erro); }
}

async function buscarProduto(req, res, next) {
  try {
    const produto = await obterProduto(req.params.id);
    if (!produto) return res.status(404).json({ mensagem: "Produto não encontrado." });
    return res.status(200).json(produto);
  } catch (erro) { return next(erro); }
}

async function criarProduto(req, res, next) {
  const { codigo, nome, descricao = null, unidade = "peca", ativo = true } = req.body;
  if (!codigo || !nome) {
    return res.status(400).json({ mensagem: "Os campos código e nome são obrigatórios." });
  }
  try {
    const [resultado] = await banco.query(
      `INSERT INTO produtos (codigo, nome, descricao, unidade, ativo)
       VALUES (?, ?, ?, ?, ?)`,
      [codigo, nome, descricao, unidade, ativo]
    );
    return res.status(201).json(await obterProduto(resultado.insertId));
  } catch (erro) { return next(erro); }
}

async function atualizarProduto(req, res, next) {
  const { codigo, nome, descricao = null, unidade = "peca", ativo = true } = req.body;
  if (!codigo || !nome) {
    return res.status(400).json({ mensagem: "Os campos código e nome são obrigatórios." });
  }
  try {
    const [resultado] = await banco.query(
      `UPDATE produtos SET codigo = ?, nome = ?, descricao = ?, unidade = ?, ativo = ?
       WHERE id = ?`,
      [codigo, nome, descricao, unidade, ativo, req.params.id]
    );
    if (!resultado.affectedRows) return res.status(404).json({ mensagem: "Produto não encontrado." });
    return res.status(200).json(await obterProduto(req.params.id));
  } catch (erro) { return next(erro); }
}

async function excluirProduto(req, res, next) {
  try {
    const [resultado] = await banco.query("DELETE FROM produtos WHERE id = ?", [req.params.id]);
    if (!resultado.affectedRows) return res.status(404).json({ mensagem: "Produto não encontrado." });
    return res.status(204).send();
  } catch (erro) { return next(erro); }
}

module.exports = { listarProdutos, buscarProduto, criarProduto, atualizarProduto, excluirProduto };
