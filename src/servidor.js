require("dotenv").config();

const app = require("./app");
const banco = require("./configuracao/banco");

const porta = process.env.PORTA || 3000;

async function iniciarServidor() {
  try {
    await banco.query("SELECT NOW()");
    console.log("Conexão com o MySQL realizada com sucesso.");
  } catch (erro) {
    console.warn("Aviso: não foi possível conectar ao MySQL.");
    console.warn("As rotas do banco ficarão indisponíveis:", erro.message);
  }

  app.listen(porta, () => {
    console.log(`API EcoFactory iniciada em http://localhost:${porta}`);
  });
}

iniciarServidor();
