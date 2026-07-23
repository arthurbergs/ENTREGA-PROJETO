const { Pool } = require("pg");

const banco = new Pool({
  connectionString: process.env.DATABASE_URL
});

banco.on("error", (erro) => {
  console.error("Ocorreu um erro inesperado no banco:", erro.message);
});

module.exports = banco;
