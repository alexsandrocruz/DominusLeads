-- name: CreateSimples :exec
INSERT INTO simples (
    cnpj_basico,
    opcao_pelo_simples,
    data_opcao_pelo_simples,
    data_exclusao_do_simples,
    opcao_pelo_mei,
    data_opcao_pelo_mei,
    data_exclusao_do_mei
) VALUES (
    $1, $2, $3, $4, $5, $6, $7
);

-- name: CreateSimplesBatch :batchexec
INSERT INTO simples (
    cnpj_basico,
    opcao_pelo_simples,
    data_opcao_pelo_simples,
    data_exclusao_do_simples,
    opcao_pelo_mei,
    data_opcao_pelo_mei,
    data_exclusao_do_mei
) VALUES (
    $1, $2, $3, $4, $5, $6, $7
);
