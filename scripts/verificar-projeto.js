const { execFileSync } = require("child_process");
const { existsSync } = require("fs");
const path = require("path");

const raiz = path.resolve(__dirname, "..");

const arquivosObrigatorios = [
  ".openai/hosting.json",
  "backend/src/servidor.js",
  "backend/src/app.js",
  "database/schema.sql",
  "database/seed.sql",
  "public/index.html",
  "public/assets/css/styles.css",
  "public/assets/js/app.js"
];

const arquivosJavaScript = [
  "backend/src/servidor.js",
  "backend/src/app.js",
  "backend/src/config/banco.js",
  "backend/src/controladores/maquinasControlador.js",
  "backend/src/controladores/produtosControlador.js",
  "backend/src/middlewares/tratamentoErros.js",
  "backend/src/repositorios/maquinasRepositorio.js",
  "backend/src/repositorios/produtosRepositorio.js",
  "backend/src/rotas/maquinasRotas.js",
  "backend/src/rotas/produtosRotas.js",
  "public/assets/js/app.js",
  "public/assets/js/dados/dados-iniciais.js",
  "public/assets/js/servicos/api.js",
  "public/assets/js/servicos/armazenamento.js",
  "public/assets/js/utilitarios/formatacao.js"
];

const ausentes = arquivosObrigatorios.filter(
  arquivo => !existsSync(path.join(raiz, arquivo))
);

if (ausentes.length) {
  throw new Error(`Arquivos obrigatórios ausentes: ${ausentes.join(", ")}`);
}

for (const arquivo of arquivosJavaScript) {
  execFileSync(process.execPath, ["--check", path.join(raiz, arquivo)], {
    stdio: "inherit"
  });
}

console.log(`Projeto validado: ${arquivosJavaScript.length} arquivos JavaScript.`);
