BEGIN;

INSERT INTO funcionarios (nome, matricula, cargo, email) VALUES
('Arthur Bergs', 'FUN-001', 'Administrador', 'arthur@ecofactory.local'),
('Marina Souza', 'FUN-002', 'Supervisora de producao', 'marina@ecofactory.local'),
('Carlos Lima', 'FUN-003', 'Operador', 'carlos@ecofactory.local');

-- Substitua a senha_hash pela saída do bcrypt na API; este valor é apenas demonstrativo.
INSERT INTO usuarios (funcionario_id, nome, email, senha_hash, perfil)
SELECT id, nome, email, '$2b$12$SUBSTITUA_POR_UM_HASH_BCRYPT_VALIDO', 'administrador'
FROM funcionarios WHERE matricula = 'FUN-001';

INSERT INTO produtos (codigo, nome) VALUES
('PROD-A', 'Produto A'), ('PROD-B', 'Produto B'),
('PROD-C', 'Produto C'), ('PROD-D', 'Produto D'),
('OUTROS', 'Outros');

INSERT INTO maquinas (codigo, nome, tipo, localizacao, status, temperatura_maxima_c) VALUES
('CNC-01', 'CNC 01', 'CNC', 'Linha 1', 'online', 80),
('PRENSA-02', 'Prensa 02', 'Prensa', 'Linha 1', 'atencao', 70),
('SOLDA-03', 'Solda 03', 'Solda', 'Linha 2', 'online', 75),
('PINTURA-04', 'Pintura 04', 'Pintura', 'Linha 2', 'parada', 60),
('CNC-05', 'CNC 05', 'CNC', 'Linha 3', 'online', 80),
('MAQ-07', 'Maquina 07', 'Usinagem', 'Linha 3', 'atencao', 80);

INSERT INTO ordens_producao
    (numero, produto_id, maquina_id, responsavel_id, quantidade_planejada,
     quantidade_produzida, status, inicio_previsto, inicio_real)
SELECT 'OP-2025-001', p.id, m.id, f.id, 500, 450, 'em_andamento',
       CURRENT_DATE, CURRENT_DATE
FROM produtos p, maquinas m, funcionarios f
WHERE p.codigo = 'PROD-A' AND m.codigo = 'CNC-01' AND f.matricula = 'FUN-002';

INSERT INTO leituras_maquina
    (maquina_id, temperatura_c, eficiencia_percentual, consumo_kwh, emissao_co2_kg)
SELECT id,
       CASE codigo WHEN 'CNC-01' THEN 42 WHEN 'PRENSA-02' THEN 65
                   WHEN 'SOLDA-03' THEN 38 WHEN 'CNC-05' THEN 45 ELSE NULL END,
       CASE codigo WHEN 'CNC-01' THEN 75 WHEN 'PRENSA-02' THEN 60
                   WHEN 'SOLDA-03' THEN 90 WHEN 'PINTURA-04' THEN 0
                   WHEN 'CNC-05' THEN 80 ELSE 55 END,
       0, 0
FROM maquinas;

INSERT INTO alertas (maquina_id, nivel, titulo, descricao)
SELECT id, 'critico', 'Temperatura alta na Maquina 07', '85 C detectados'
FROM maquinas WHERE codigo = 'MAQ-07';

INSERT INTO alertas (maquina_id, nivel, titulo, descricao)
SELECT id, 'atencao', 'Vibracao anormal na Prensa 02', 'Nivel acima do permitido'
FROM maquinas WHERE codigo = 'PRENSA-02';

COMMIT;
