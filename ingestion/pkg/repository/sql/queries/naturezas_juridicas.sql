-- name: CreateNaturezaJuridica :exec
INSERT INTO naturezas_juridicas (
    codigo,
    descricao
) VALUES (
    $1, $2
);

-- name: CreateNaturezaJuridicaBatch :batchexec
INSERT INTO naturezas_juridicas (
    codigo,
    descricao
) VALUES (
    $1, $2
);
