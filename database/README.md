# Banco MySQL EcoFactory

O `schema.sql` cria o banco `ecofactory`, suas tabelas, relacionamentos,
restrições e índices em InnoDB. O `seed.sql` insere os dados demonstrativos.

```powershell
mysql -u root -p < database/schema.sql
mysql -u root -p ecofactory < database/seed.sql
```

Execute o schema uma vez em um banco vazio. Configure a API pelas variáveis
`DB_HOST`, `DB_PORTA`, `DB_USUARIO`, `DB_SENHA` e `DB_NOME`.

Senhas de usuários devem ser armazenadas somente como hashes seguros; o valor
do seed é apenas ilustrativo.
