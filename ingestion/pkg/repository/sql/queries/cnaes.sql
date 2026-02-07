-- name: CreateCnae :exec
INSERT INTO cnaes (
    codigo,
    descricao
) VALUES (
    $1, $2
);

-- name: CreateCnaeBatch :batchexec
INSERT INTO cnaes (
    codigo,
    descricao
) VALUES (
    $1, $2
);
