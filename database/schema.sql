BEGIN;

CREATE TYPE perfil_usuario AS ENUM ('administrador', 'gestor', 'operador');
CREATE TYPE status_maquina AS ENUM ('online', 'atencao', 'parada', 'manutencao');
CREATE TYPE status_ordem AS ENUM ('planejada', 'em_andamento', 'pausada', 'concluida', 'cancelada');
CREATE TYPE nivel_alerta AS ENUM ('informacao', 'atencao', 'critico');

CREATE TABLE funcionarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    matricula VARCHAR(30) NOT NULL UNIQUE,
    cargo VARCHAR(80) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    telefone VARCHAR(25),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    funcionario_id BIGINT UNIQUE REFERENCES funcionarios(id) ON DELETE SET NULL,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    perfil perfil_usuario NOT NULL DEFAULT 'operador',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_login_em TIMESTAMPTZ,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE produtos (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nome VARCHAR(120) NOT NULL,
    descricao TEXT,
    unidade VARCHAR(20) NOT NULL DEFAULT 'peca',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE maquinas (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nome VARCHAR(120) NOT NULL,
    tipo VARCHAR(80) NOT NULL,
    localizacao VARCHAR(120),
    status status_maquina NOT NULL DEFAULT 'parada',
    temperatura_maxima_c NUMERIC(6,2),
    ativa BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (temperatura_maxima_c IS NULL OR temperatura_maxima_c > 0)
);

CREATE TABLE ordens_producao (
    id BIGSERIAL PRIMARY KEY,
    numero VARCHAR(30) NOT NULL UNIQUE,
    produto_id BIGINT NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT,
    maquina_id BIGINT REFERENCES maquinas(id) ON DELETE SET NULL,
    responsavel_id BIGINT REFERENCES funcionarios(id) ON DELETE SET NULL,
    quantidade_planejada INTEGER NOT NULL CHECK (quantidade_planejada > 0),
    quantidade_produzida INTEGER NOT NULL DEFAULT 0 CHECK (quantidade_produzida >= 0),
    status status_ordem NOT NULL DEFAULT 'planejada',
    inicio_previsto TIMESTAMPTZ,
    fim_previsto TIMESTAMPTZ,
    inicio_real TIMESTAMPTZ,
    fim_real TIMESTAMPTZ,
    observacoes TEXT,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (fim_previsto IS NULL OR inicio_previsto IS NULL OR fim_previsto >= inicio_previsto),
    CHECK (fim_real IS NULL OR inicio_real IS NULL OR fim_real >= inicio_real)
);

CREATE TABLE leituras_maquina (
    id BIGSERIAL PRIMARY KEY,
    maquina_id BIGINT NOT NULL REFERENCES maquinas(id) ON DELETE CASCADE,
    registrada_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    temperatura_c NUMERIC(6,2),
    vibracao_mm_s NUMERIC(8,3),
    eficiencia_percentual NUMERIC(5,2),
    consumo_kwh NUMERIC(12,3),
    emissao_co2_kg NUMERIC(12,3),
    CHECK (eficiencia_percentual BETWEEN 0 AND 100),
    CHECK (consumo_kwh IS NULL OR consumo_kwh >= 0),
    CHECK (emissao_co2_kg IS NULL OR emissao_co2_kg >= 0)
);

CREATE TABLE registros_producao (
    id BIGSERIAL PRIMARY KEY,
    ordem_id BIGINT NOT NULL REFERENCES ordens_producao(id) ON DELETE CASCADE,
    maquina_id BIGINT NOT NULL REFERENCES maquinas(id) ON DELETE RESTRICT,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    rejeitadas INTEGER NOT NULL DEFAULT 0 CHECK (rejeitadas >= 0),
    registrada_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (rejeitadas <= quantidade)
);

CREATE TABLE alertas (
    id BIGSERIAL PRIMARY KEY,
    maquina_id BIGINT REFERENCES maquinas(id) ON DELETE SET NULL,
    nivel nivel_alerta NOT NULL,
    titulo VARCHAR(180) NOT NULL,
    descricao TEXT,
    resolvido BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolvido_em TIMESTAMPTZ,
    resolvido_por BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
    CHECK ((resolvido = FALSE AND resolvido_em IS NULL) OR resolvido = TRUE)
);

CREATE INDEX idx_leituras_maquina_data ON leituras_maquina (maquina_id, registrada_em DESC);
CREATE INDEX idx_producao_data ON registros_producao (registrada_em DESC);
CREATE INDEX idx_ordens_status ON ordens_producao (status);
CREATE INDEX idx_alertas_abertos ON alertas (criado_em DESC) WHERE resolvido = FALSE;

CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER funcionarios_atualizado BEFORE UPDATE ON funcionarios
FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();
CREATE TRIGGER usuarios_atualizado BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();
CREATE TRIGGER produtos_atualizado BEFORE UPDATE ON produtos
FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();
CREATE TRIGGER maquinas_atualizado BEFORE UPDATE ON maquinas
FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();
CREATE TRIGGER ordens_atualizado BEFORE UPDATE ON ordens_producao
FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();

COMMIT;
