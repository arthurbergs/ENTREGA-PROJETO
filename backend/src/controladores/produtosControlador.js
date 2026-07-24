const produtosRepositorio = require("../repositorios/produtosRepositorio");

function validarProduto(dados) {
  return dados.codigo && dados.nome
    ? null
    : "Os campos código e nome são obrigatórios.";
}

function normalizarProduto(dados) {
  return {
    codigo: dados.codigo,
    nome: dados.nome,
    descricao: dados.descricao || null,
    unidade: dados.unidade || "peca",
    ativo: dados.ativo ?? true
  };
}

async function listarProdutos(req, res, next) {
  try {
    const produtos = await produtosRepositorio.listar();
    return res.status(200).json(produtos);
  } catch (erro) {
    return next(erro);
  }
}

async function buscarProduto(req, res, next) {
  try {
    const produto = await produtosRepositorio.buscarPorId(req.params.id);

    if (!produto) {
      return res.status(404).json({ mensagem: "Produto não encontrado." });
    }

    return res.status(200).json(produto);
  } catch (erro) {
    return next(erro);
  }
}

async function criarProduto(req, res, next) {
  const mensagem = validarProduto(req.body);

  if (mensagem) {
    return res.status(400).json({ mensagem });
  }

  try {
    const produto = await produtosRepositorio.criar(
      normalizarProduto(req.body)
    );
    return res.status(201).json(produto);
  } catch (erro) {
    return next(erro);
  }
}

async function atualizarProduto(req, res, next) {
  const mensagem = validarProduto(req.body);

  if (mensagem) {
    return res.status(400).json({ mensagem });
  }

  try {
    const produto = await produtosRepositorio.atualizar(
      req.params.id,
      normalizarProduto(req.body)
    );

    if (!produto) {
      return res.status(404).json({ mensagem: "Produto não encontrado." });
    }

    return res.status(200).json(produto);
  } catch (erro) {
    return next(erro);
  }
}

async function excluirProduto(req, res, next) {
  try {
    const excluido = await produtosRepositorio.excluir(req.params.id);

    if (!excluido) {
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
