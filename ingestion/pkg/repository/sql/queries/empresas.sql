-- name: CreateEmpresa :exec
INSERT INTO empresas (
    cnpj_basico,
    razao_social,
    natureza_juridica,
    qualificacao_responsavel,
    capital_social,
    porte,
    ente_federativo_responsavel
) VALUES (
    $1, $2, $3, $4, $5, $6, $7
);

-- name: CreateEmpresaBatch :batchexec
INSERT INTO empresas (
    cnpj_basico,
    razao_social,
    natureza_juridica,
    qualificacao_responsavel,
    capital_social,
    porte,
    ente_federativo_responsavel
) VALUES (
    $1, $2, $3, $4, $5, $6, $7
);
