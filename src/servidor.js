require("dotenv").config();

const app = require("./app");
const banco = require("./configuracao/banco");

const porta = process.env.PORTA || 3000;

async function iniciarServidor() {
  if (!process.env.DATABASE_URL) {
    console.warn("Aviso: a variável DATABASE_URL não foi configurada.");
    console.warn("A API será iniciada, mas as rotas do banco não funcionarão.");
  } else {
    try {
      await banco.query("SELECT NOW()");
      console.log("Conexão com o PostgreSQL realizada com sucesso.");
    } catch (erro) {
      console.warn("Aviso: não foi possível conectar ao PostgreSQL.");
      console.warn("As rotas do banco ficarão indisponíveis:", erro.message);
    }
  }

  app.listen(porta, () => {
    console.log(`API EcoFactory iniciada em http://localhost:${porta}`);
  });
}

iniciarServidor();
