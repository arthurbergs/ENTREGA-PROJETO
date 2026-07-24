CREATE DATABASE IF NOT EXISTS ecofactory
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecofactory;

CREATE TABLE funcionarios (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  matricula VARCHAR(30) NOT NULL UNIQUE,
  cargo VARCHAR(80) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  telefone VARCHAR(25),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE usuarios (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  funcionario_id BIGINT UNSIGNED UNIQUE,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  perfil ENUM('administrador','gestor','operador') NOT NULL DEFAULT 'operador',
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  ultimo_login_em DATETIME,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuario_funcionario FOREIGN KEY (funcionario_id)
    REFERENCES funcionarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE produtos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  nome VARCHAR(120) NOT NULL,
  descricao TEXT,
  unidade VARCHAR(20) NOT NULL DEFAULT 'peca',
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE maquinas (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  nome VARCHAR(120) NOT NULL,
  tipo VARCHAR(80) NOT NULL,
  localizacao VARCHAR(120),
  status ENUM('online','atencao','parada','manutencao') NOT NULL DEFAULT 'parada',
  temperatura_maxima_c DECIMAL(6,2),
  ativa BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (temperatura_maxima_c IS NULL OR temperatura_maxima_c > 0)
) ENGINE=InnoDB;

CREATE TABLE ordens_producao (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(30) NOT NULL UNIQUE,
  produto_id BIGINT UNSIGNED NOT NULL,
  maquina_id BIGINT UNSIGNED,
  responsavel_id BIGINT UNSIGNED,
  quantidade_planejada INT NOT NULL,
  quantidade_produzida INT NOT NULL DEFAULT 0,
  status ENUM('planejada','em_andamento','pausada','concluida','cancelada') NOT NULL DEFAULT 'planejada',
  inicio_previsto DATETIME, fim_previsto DATETIME,
  inicio_real DATETIME, fim_real DATETIME,
  observacoes TEXT,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ordem_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT,
  CONSTRAINT fk_ordem_maquina FOREIGN KEY (maquina_id) REFERENCES maquinas(id) ON DELETE SET NULL,
  CONSTRAINT fk_ordem_responsavel FOREIGN KEY (responsavel_id) REFERENCES funcionarios(id) ON DELETE SET NULL,
  CHECK (quantidade_planejada > 0),
  CHECK (quantidade_produzida >= 0)
) ENGINE=InnoDB;

CREATE TABLE leituras_maquina (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  maquina_id BIGINT UNSIGNED NOT NULL,
  registrada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  temperatura_c DECIMAL(6,2),
  vibracao_mm_s DECIMAL(8,3),
  eficiencia_percentual DECIMAL(5,2),
  consumo_kwh DECIMAL(12,3),
  emissao_co2_kg DECIMAL(12,3),
  CONSTRAINT fk_leitura_maquina FOREIGN KEY (maquina_id) REFERENCES maquinas(id) ON DELETE CASCADE,
  CHECK (eficiencia_percentual BETWEEN 0 AND 100),
  CHECK (consumo_kwh IS NULL OR consumo_kwh >= 0),
  CHECK (emissao_co2_kg IS NULL OR emissao_co2_kg >= 0),
  INDEX idx_leituras_maquina_data (maquina_id, registrada_em)
) ENGINE=InnoDB;

CREATE TABLE registros_producao (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ordem_id BIGINT UNSIGNED NOT NULL,
  maquina_id BIGINT UNSIGNED NOT NULL,
  quantidade INT NOT NULL,
  rejeitadas INT NOT NULL DEFAULT 0,
  registrada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_registro_ordem FOREIGN KEY (ordem_id) REFERENCES ordens_producao(id) ON DELETE CASCADE,
  CONSTRAINT fk_registro_maquina FOREIGN KEY (maquina_id) REFERENCES maquinas(id) ON DELETE RESTRICT,
  CHECK (quantidade > 0),
  CHECK (rejeitadas BETWEEN 0 AND quantidade),
  INDEX idx_producao_data (registrada_em)
) ENGINE=InnoDB;

CREATE TABLE alertas (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  maquina_id BIGINT UNSIGNED,
  nivel ENUM('informacao','atencao','critico') NOT NULL,
  titulo VARCHAR(180) NOT NULL,
  descricao TEXT,
  resolvido BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolvido_em DATETIME,
  resolvido_por BIGINT UNSIGNED,
  CONSTRAINT fk_alerta_maquina FOREIGN KEY (maquina_id) REFERENCES maquinas(id) ON DELETE SET NULL,
  CONSTRAINT fk_alerta_usuario FOREIGN KEY (resolvido_por) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_alertas_abertos (resolvido, criado_em)
) ENGINE=InnoDB;
