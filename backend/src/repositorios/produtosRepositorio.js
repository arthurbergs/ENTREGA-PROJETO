const banco = require("../config/banco");

async function listar() {
  const [linhas] = await banco.query(`
    SELECT id, codigo, nome, descricao, unidade, ativo, criado_em, atualizado_em
    FROM produtos
    ORDER BY id
  `);

  return linhas;
}

async function buscarPorId(id) {
  const [linhas] = await banco.query(
    "SELECT * FROM produtos WHERE id = ?",
    [id]
  );

  return linhas[0] || null;
}

async function criar(dados) {
  const [resultado] = await banco.query(
    `INSERT INTO produtos (codigo, nome, descricao, unidade, ativo)
     VALUES (?, ?, ?, ?, ?)`,
    [dados.codigo, dados.nome, dados.descricao, dados.unidade, dados.ativo]
  );

  return buscarPorId(resultado.insertId);
}

async function atualizar(id, dados) {
  const [resultado] = await banco.query(
    `UPDATE produtos
     SET codigo = ?, nome = ?, descricao = ?, unidade = ?, ativo = ?
     WHERE id = ?`,
    [
      dados.codigo,
      dados.nome,
      dados.descricao,
      dados.unidade,
      dados.ativo,
      id
    ]
  );

  return resultado.affectedRows ? buscarPorId(id) : null;
}

async function excluir(id) {
  const [resultado] = await banco.query(
    "DELETE FROM produtos WHERE id = ?",
    [id]
  );

  return resultado.affectedRows > 0;
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  excluir
};
