# EcoFactory - Encontro 7

Neste encontro foi criado o back-end do projeto usando Node.js, Express e
PostgreSQL. A API possui operações CRUD completas para máquinas e produtos.

## Tecnologias utilizadas

- Node.js;
- Express;
- PostgreSQL;
- biblioteca `pg` para conectar com o banco;
- dotenv para variáveis de ambiente;
- CORS para permitir o acesso do front-end.

## Como executar

É necessário ter o Node.js e o PostgreSQL instalados.

1. Crie um banco chamado `ecofactory`.
2. Execute os arquivos do banco:

```powershell
psql -d ecofactory -f database/schema.sql
psql -d ecofactory -f database/seed.sql
```

3. Instale as dependências:

```powershell
npm install
```

4. Copie `.env.exemplo` para `.env` e altere a conexão, se necessário:

```env
PORTA=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecofactory
```

5. Inicie a API:

```powershell
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

## Rotas CRUD

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/maquinas` | Lista as máquinas |
| GET | `/api/maquinas/:id` | Busca uma máquina |
| POST | `/api/maquinas` | Cadastra uma máquina |
| PUT | `/api/maquinas/:id` | Atualiza uma máquina |
| DELETE | `/api/maquinas/:id` | Exclui uma máquina |
| GET | `/api/produtos` | Lista os produtos |
| GET | `/api/produtos/:id` | Busca um produto |
| POST | `/api/produtos` | Cadastra um produto |
| PUT | `/api/produtos/:id` | Atualiza um produto |
| DELETE | `/api/produtos/:id` | Exclui um produto |

Exemplo para cadastrar um produto:

```json
{
  "codigo": "PROD-E",
  "nome": "Produto E",
  "descricao": "Peça criada para teste da API",
  "unidade": "peca",
  "ativo": true
}
```

Exemplo para cadastrar uma máquina:

```json
{
  "codigo": "CORTE-06",
  "nome": "Cortadora 06",
  "tipo": "Corte",
  "localizacao": "Linha 3",
  "status": "online",
  "temperatura_maxima_c": 75,
  "ativa": true
}
```
