-- name: CreateSocio :exec
INSERT INTO socios (
    cnpj_basico,
    identificador_de_socio,
    nome_socio,
    cnpj_cpf_socio,
    qualificacao_socio,
    data_entrada_sociedade,
    pais,
    representante_legal,
    nome_representante,
    qualificacao_representante_legal,
    faixa_etaria
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
);

-- name: CreateSocioBatch :batchexec
INSERT INTO socios (
    cnpj_basico,
    identificador_de_socio,
    nome_socio,
    cnpj_cpf_socio,
    qualificacao_socio,
    data_entrada_sociedade,
    pais,
    representante_legal,
    nome_representante,
    qualificacao_representante_legal,
    faixa_etaria
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
);
