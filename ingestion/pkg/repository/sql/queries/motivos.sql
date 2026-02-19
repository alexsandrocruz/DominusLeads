-- name: CreateMotivo :exec
INSERT INTO motivos (
    codigo,
    descricao
) VALUES (
    $1, $2
);

-- name: CreateMotivoBatch :batchexec
INSERT INTO motivos (
    codigo,
    descricao
) VALUES (
    $1, $2
);
