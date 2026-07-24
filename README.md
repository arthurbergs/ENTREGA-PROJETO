# EcoFactory — Encontro 8

Front-end integrado a uma API REST real, com dados persistidos em **MySQL**.
O painel consome máquinas e produtos com `fetch`; o cadastro, a edição e a
exclusão de máquinas são persistidos pela API. A interface também informa
carregamento, sucesso e erros.

## Tecnologias

- HTML, CSS e JavaScript;
- Node.js e Express;
- MySQL e driver `mysql2`;
- CORS e dotenv.

## Como executar

Pré-requisitos: Node.js e MySQL 8 ou superior.

1. Crie as tabelas e os dados demonstrativos:

```powershell
mysql -u root -p < database/schema.sql
mysql -u root -p ecofactory < database/seed.sql
```

2. Copie `.env.exemplo` para `.env` e informe sua senha:

```env
PORTA=3000
DB_HOST=localhost
DB_PORTA=3306
DB_USUARIO=root
DB_SENHA=sua_senha
DB_NOME=ecofactory
```

3. Instale e execute:

```powershell
npm install
npm run dev
```

4. Acesse `http://localhost:3000`. Não abra o `index.html` diretamente, pois o
front-end usa as rotas `/api` do mesmo servidor.

## Rotas

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

Exemplo de máquina:

```json
{
  "codigo": "CORTE-06",
  "nome": "Cortadora 06",
  "tipo": "Corte",
  "localizacao": "Linha 3",
  "status": "online",
  "temperatura": 48,
  "eficiencia": 82,
  "ativa": true
}
```

As demais áreas do painel continuam demonstrativas e locais; o escopo da
integração do Encontro 8 está concentrado nos recursos já expostos pela API:
máquinas e produtos.
