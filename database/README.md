# Banco de dados EcoFactory

Modelo PostgreSQL para usuários, funcionários, produtos, máquinas, ordens e
registros de produção, telemetria (energia, emissão, temperatura e eficiência) e
alertas de manutenção.

## Criar localmente

Com um banco PostgreSQL já criado e a variável `DATABASE_URL` configurada:

```powershell
psql $env:DATABASE_URL -f database/schema.sql
psql $env:DATABASE_URL -f database/seed.sql
```

O `schema.sql` deve ser executado uma vez. O `seed.sql` inclui dados de
demonstração equivalentes aos exibidos no dashboard atual.

Não armazene senhas em texto puro. A futura API Node deve gerar hashes com
bcrypt antes de inserir ou atualizar um usuário.

## Relações principais

- um funcionário pode possuir uma conta de usuário;
- uma ordem pertence a um produto e pode ser atribuída a máquina e responsável;
- uma máquina possui várias leituras, produções e alertas;
- registros horários alimentam os gráficos e indicadores do dashboard.
