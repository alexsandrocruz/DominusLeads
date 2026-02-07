CREATE INDEX idx_estabelecimentos_situacao_cadastral ON estabelecimentos (situacao_cadastral);
CREATE INDEX idx_estabelecimentos_ativos_municipio_cnae ON estabelecimentos_ativos (municipio, cnaes);
CREATE INDEX idx_cnaes_codigo ON cnaes (codigo);
CREATE INDEX idx_cnaes_descricao ON cnaes USING gin (to_tsvector('portuguese', descricao));