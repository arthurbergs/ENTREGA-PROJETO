const banco = require("../config/banco");

const camposMaquina = `
  m.id,
  m.codigo,
  m.nome,
  m.tipo,
  m.localizacao,
  m.status,
  m.temperatura_maxima_c,
  m.ativa,
  m.criado_em,
  m.atualizado_em,
  COALESCE(l.temperatura_c, 0) AS temperatura,
  COALESCE(l.eficiencia_percentual, 0) AS eficiencia
`;

const juncaoUltimaLeitura = `
  LEFT JOIN leituras_maquina l ON l.id = (
    SELECT lm.id
    FROM leituras_maquina lm
    WHERE lm.maquina_id = m.id
    ORDER BY lm.registrada_em DESC, lm.id DESC
    LIMIT 1
  )
`;

async function listar() {
  const [linhas] = await banco.query(`
    SELECT ${camposMaquina}
    FROM maquinas m
    ${juncaoUltimaLeitura}
    ORDER BY m.id
  `);

  return linhas;
}

async function buscarPorId(id, conexao = banco) {
  const [linhas] = await conexao.query(
    `SELECT ${camposMaquina}
     FROM maquinas m
     ${juncaoUltimaLeitura}
     WHERE m.id = ?`,
    [id]
  );

  return linhas[0] || null;
}

async function inserirLeitura(conexao, maquinaId, dados) {
  await conexao.query(
    `INSERT INTO leituras_maquina
      (maquina_id, temperatura_c, eficiencia_percentual)
     VALUES (?, ?, ?)`,
    [maquinaId, dados.temperatura, dados.eficiencia]
  );
}

async function criar(dados) {
  const conexao = await banco.getConnection();

  try {
    await conexao.beginTransaction();

    const [resultado] = await conexao.query(
      `INSERT INTO maquinas
        (codigo, nome, tipo, localizacao, status, temperatura_maxima_c, ativa)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        dados.codigo,
        dados.nome,
        dados.tipo,
        dados.localizacao,
        dados.status,
        dados.temperatura_maxima_c,
        dados.ativa
      ]
    );

    await inserirLeitura(conexao, resultado.insertId, dados);
    await conexao.commit();

    return buscarPorId(resultado.insertId);
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}

async function atualizar(id, dados) {
  const conexao = await banco.getConnection();

  try {
    await conexao.beginTransaction();

    const [resultado] = await conexao.query(
      `UPDATE maquinas
       SET codigo = ?, nome = ?, tipo = ?, localizacao = ?, status = ?,
           temperatura_maxima_c = ?, ativa = ?
       WHERE id = ?`,
      [
        dados.codigo,
        dados.nome,
        dados.tipo,
        dados.localizacao,
        dados.status,
        dados.temperatura_maxima_c,
        dados.ativa,
        id
      ]
    );

    if (!resultado.affectedRows) {
      await conexao.rollback();
      return null;
    }

    await inserirLeitura(conexao, id, dados);
    await conexao.commit();

    return buscarPorId(id);
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}

async function excluir(id) {
  const [resultado] = await banco.query(
    "DELETE FROM maquinas WHERE id = ?",
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
