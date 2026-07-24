const banco = require("../configuracao/banco");

const statusPermitidos = ["online", "atencao", "parada", "manutencao"];
const camposMaquina = `m.id, m.codigo, m.nome, m.tipo, m.localizacao, m.status,
  m.temperatura_maxima_c, m.ativa, m.criado_em, m.atualizado_em,
  COALESCE(l.temperatura_c, 0) AS temperatura,
  COALESCE(l.eficiencia_percentual, 0) AS eficiencia`;
const juncaoLeitura = `LEFT JOIN leituras_maquina l ON l.id = (
  SELECT lm.id FROM leituras_maquina lm
  WHERE lm.maquina_id = m.id ORDER BY lm.registrada_em DESC, lm.id DESC LIMIT 1
)`;

async function obterMaquina(id, conexao = banco) {
  const [linhas] = await conexao.query(
    `SELECT ${camposMaquina} FROM maquinas m ${juncaoLeitura} WHERE m.id = ?`, [id]
  );
  return linhas[0];
}

function validar(corpo) {
  if (!corpo.codigo || !corpo.nome || !corpo.tipo) return "Código, nome e tipo são obrigatórios.";
  if (!statusPermitidos.includes(corpo.status || "parada")) return "O status informado é inválido.";
}

async function listarMaquinas(req, res, next) {
  try {
    const [linhas] = await banco.query(
      `SELECT ${camposMaquina} FROM maquinas m ${juncaoLeitura} ORDER BY m.id`
    );
    return res.status(200).json(linhas);
  } catch (erro) { return next(erro); }
}

async function buscarMaquina(req, res, next) {
  try {
    const maquina = await obterMaquina(req.params.id);
    if (!maquina) return res.status(404).json({ mensagem: "Máquina não encontrada." });
    return res.status(200).json(maquina);
  } catch (erro) { return next(erro); }
}

async function criarMaquina(req, res, next) {
  const mensagem = validar(req.body);
  if (mensagem) return res.status(400).json({ mensagem });
  let conexao;
  try {
    conexao = await banco.getConnection();
    await conexao.beginTransaction();
    const { codigo, nome, tipo, localizacao = null, status = "parada",
      temperatura_maxima_c = null, ativa = true, temperatura = 0, eficiencia = 0 } = req.body;
    const [resultado] = await conexao.query(
      `INSERT INTO maquinas
       (codigo, nome, tipo, localizacao, status, temperatura_maxima_c, ativa)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [codigo, nome, tipo, localizacao, status, temperatura_maxima_c, ativa]
    );
    await conexao.query(
      `INSERT INTO leituras_maquina (maquina_id, temperatura_c, eficiencia_percentual)
       VALUES (?, ?, ?)`, [resultado.insertId, temperatura, eficiencia]
    );
    await conexao.commit();
    return res.status(201).json(await obterMaquina(resultado.insertId));
  } catch (erro) {
    if (conexao) await conexao.rollback();
    return next(erro);
  } finally { if (conexao) conexao.release(); }
}

async function atualizarMaquina(req, res, next) {
  const mensagem = validar(req.body);
  if (mensagem) return res.status(400).json({ mensagem });
  let conexao;
  try {
    conexao = await banco.getConnection();
    await conexao.beginTransaction();
    const { codigo, nome, tipo, localizacao = null, status = "parada",
      temperatura_maxima_c = null, ativa = true, temperatura = 0, eficiencia = 0 } = req.body;
    const [resultado] = await conexao.query(
      `UPDATE maquinas SET codigo = ?, nome = ?, tipo = ?, localizacao = ?,
       status = ?, temperatura_maxima_c = ?, ativa = ? WHERE id = ?`,
      [codigo, nome, tipo, localizacao, status, temperatura_maxima_c, ativa, req.params.id]
    );
    if (!resultado.affectedRows) {
      await conexao.rollback();
      return res.status(404).json({ mensagem: "Máquina não encontrada." });
    }
    await conexao.query(
      `INSERT INTO leituras_maquina (maquina_id, temperatura_c, eficiencia_percentual)
       VALUES (?, ?, ?)`, [req.params.id, temperatura, eficiencia]
    );
    await conexao.commit();
    return res.status(200).json(await obterMaquina(req.params.id));
  } catch (erro) {
    if (conexao) await conexao.rollback();
    return next(erro);
  } finally { if (conexao) conexao.release(); }
}

async function excluirMaquina(req, res, next) {
  try {
    const [resultado] = await banco.query("DELETE FROM maquinas WHERE id = ?", [req.params.id]);
    if (!resultado.affectedRows) return res.status(404).json({ mensagem: "Máquina não encontrada." });
    return res.status(204).send();
  } catch (erro) { return next(erro); }
}

module.exports = { listarMaquinas, buscarMaquina, criarMaquina, atualizarMaquina, excluirMaquina };
