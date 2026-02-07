CREATE TABLE IF NOT EXISTS empresas (
    cnpj_basico CHAR(8),
    razao_social TEXT,
    natureza_juridica CHAR(4),
    qualificacao_responsavel CHAR(2),
    capital_social NUMERIC(15, 2),
    porte CHAR(2),
    ente_federativo_responsavel TEXT,
    PRIMARY KEY (cnpj_basico)
);

CREATE TABLE IF NOT EXISTS estabelecimentos (
    cnpj_basico CHAR(8),
    cnpj_ordem CHAR(4),
    cnpj_dv CHAR(2),
    identificador_matriz_filial CHAR(1),
    nome_fantasia TEXT,
    situacao_cadastral CHAR(2),
    data_situacao_cadastral DATE,
    motivo_situacao_cadastral CHAR(2),
    nome_cidade_exterior TEXT,
    pais CHAR(3),
    data_inicio_atividade DATE,
    cnae_fiscal_principal CHAR(7),
    cnae_fiscal_secundaria TEXT,
    tipo_logradouro TEXT,
    logradouro TEXT,
    numero TEXT,
    complemento TEXT,
    bairro TEXT,
    cep CHAR(8),
    uf CHAR(2),
    municipio CHAR(4),
    ddd_1 TEXT,
    telefone_1 TEXT,
    ddd_2 TEXT,
    telefone_2 TEXT,
    ddd_fax TEXT,
    fax TEXT,
    correio_eletronico TEXT,
    situacao_especial TEXT,
    data_situacao_especial DATE,
    PRIMARY KEY (cnpj_basico, cnpj_ordem, cnpj_dv)
);

CREATE TABLE IF NOT EXISTS socios (
    cnpj_basico CHAR(8),
    identificador_de_socio CHAR(1),
    nome_socio TEXT,
    cnpj_cpf_socio TEXT,
    qualificacao_socio CHAR(2),
    data_entrada_sociedade DATE,
    pais CHAR(3),
    representante_legal CHAR(11),
    nome_representante TEXT,
    qualificacao_representante_legal CHAR(2),
    faixa_etaria CHAR(1)
);

CREATE TABLE IF NOT EXISTS simples (
    cnpj_basico CHAR(8),
    opcao_pelo_simples CHAR(1),
    data_opcao_pelo_simples DATE,
    data_exclusao_do_simples DATE,
    opcao_pelo_mei CHAR(1),
    data_opcao_pelo_mei DATE,
    data_exclusao_do_mei DATE,
    PRIMARY KEY (cnpj_basico)
);

CREATE TABLE IF NOT EXISTS paises (
    codigo CHAR(3),
    descricao TEXT,
    PRIMARY KEY (codigo)
);

CREATE TABLE IF NOT EXISTS municipios (
    codigo CHAR(4),
    descricao TEXT,
    PRIMARY KEY (codigo)
);

CREATE TABLE IF NOT EXISTS qualificacoes_de_socios (
    codigo CHAR(2),
    descricao TEXT,
    PRIMARY KEY (codigo)
);

CREATE TABLE IF NOT EXISTS naturezas_juridicas (
    codigo CHAR(4),
    descricao TEXT,
    PRIMARY KEY (codigo)
);

CREATE TABLE IF NOT EXISTS cnaes (
    codigo CHAR(7),
    descricao TEXT,
    PRIMARY KEY (codigo)
);

CREATE TABLE IF NOT EXISTS motivos (
    codigo CHAR(2),
    descricao TEXT,
    PRIMARY KEY (codigo)
);
