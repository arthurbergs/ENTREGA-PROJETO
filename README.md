# EcoFactory — Encontro 8

Painel industrial com front-end integrado a uma API REST e persistência em
MySQL. O projeto está organizado por responsabilidade para facilitar manutenção,
estudo e evolução.

## Estrutura

```text
ENTREGA-PROJETO/
├── backend/
│   └── src/
│       ├── config/          # conexão MySQL
│       ├── controladores/   # entrada e saída HTTP
│       ├── middlewares/     # erros e rotas inexistentes
│       ├── repositorios/    # consultas e transações SQL
│       ├── rotas/           # endpoints da API
│       ├── app.js
│       └── servidor.js
├── database/
│   ├── schema.sql
│   └── seed.sql
├── docs/                    # documentação acadêmica
├── public/
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   │       ├── dados/
│   │       ├── servicos/
│   │       └── utilitarios/
│   └── index.html
├── scripts/                 # validações do projeto
└── package.json
```

## Tecnologias

- HTML, CSS e JavaScript com módulos ES;
- Node.js e Express;
- MySQL com `mysql2`;
- Next/OpenNext apenas para empacotamento da hospedagem;
- CORS e dotenv.

## Execução local com MySQL

Pré-requisitos: Node.js e MySQL 8 ou superior.

1. Crie a estrutura e carregue os dados:

```powershell
mysql -u root -p < database/schema.sql
mysql -u root -p ecofactory < database/seed.sql
```

2. Copie `.env.exemplo` para `.env` e informe suas credenciais:

```env
PORTA=3000
DB_HOST=localhost
DB_PORTA=3306
DB_USUARIO=root
DB_SENHA=sua_senha
DB_NOME=ecofactory
```

3. Instale as dependências e execute:

```powershell
npm install
npm run dev
```

4. Acesse `http://localhost:3000`.

## Scripts

| Comando | Finalidade |
|---|---|
| `npm run dev` | Inicia API e front-end com reinício automático |
| `npm start` | Inicia o servidor sem nodemon |
| `npm run check` | Verifica estrutura e sintaxe dos arquivos |
| `npm run build` | Gera o build Next |
| `npm run build:sites` | Gera o pacote OpenNext da hospedagem |

## API

| Método | Rota | Ação |
|---|---|---|
| GET | `/api/maquinas` | Listar máquinas e última leitura |
| GET | `/api/maquinas/:id` | Buscar máquina |
| POST | `/api/maquinas` | Cadastrar máquina |
| PUT | `/api/maquinas/:id` | Atualizar máquina |
| DELETE | `/api/maquinas/:id` | Excluir máquina |
| GET | `/api/produtos` | Listar produtos |
| GET | `/api/produtos/:id` | Buscar produto |
| POST | `/api/produtos` | Cadastrar produto |
| PUT | `/api/produtos/:id` | Atualizar produto |
| DELETE | `/api/produtos/:id` | Excluir produto |

Na versão hospedada, os cadastros demonstrativos são mantidos no navegador. A
persistência MySQL é utilizada ao executar o servidor Node localmente ou em uma
hospedagem com credenciais de banco configuradas.
