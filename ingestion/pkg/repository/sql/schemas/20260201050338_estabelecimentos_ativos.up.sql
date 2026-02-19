CREATE MATERIALIZED VIEW estabelecimentos_ativos AS
SELECT
    e.cnpj_basico,
    e.cnpj_ordem,
    e.cnpj_dv,
    e.identificador_matriz_filial,
    e.nome_fantasia,
    e.situacao_cadastral,
    e.data_situacao_cadastral,
    e.motivo_situacao_cadastral,
    e.nome_cidade_exterior,
    p.descricao AS pais,
    e.data_inicio_atividade,
    CAST(COALESCE(
        ARRAY[e.cnae_fiscal_principal] || string_to_array(NULLIF(e.cnae_fiscal_secundaria, ''), ','),
        ARRAY[e.cnae_fiscal_principal]
    ) AS text[]) AS cnaes,
    e.tipo_logradouro,
    e.logradouro,
    e.numero,
    e.complemento,
    e.bairro,
    e.cep,
    e.uf,
    m.descricao AS municipio,
    e.ddd_1,
    e.telefone_1,
    e.ddd_2,
    e.telefone_2,
    e.ddd_fax,
    e.fax,
    e.correio_eletronico,
    e.situacao_especial,
    e.data_situacao_especial
FROM estabelecimentos e
LEFT JOIN municipios m ON e.municipio = m.codigo
LEFT JOIN paises p ON e.pais = p.codigo
WHERE e.situacao_cadastral = '02';
