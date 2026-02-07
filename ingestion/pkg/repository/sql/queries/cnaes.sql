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

-- name: GetCnaeByCodigo :one
SELECT
    codigo,
    descricao
FROM cnaes
WHERE
    codigo = sqlc.arg('codigo')::text
;

-- name: GetCnaesByDescricao :many
SELECT
    codigo,
    descricao
FROM cnaes
WHERE
    sqlc.arg('nome')::text='' OR
    to_tsvector('portuguese', descricao) @@ to_tsquery('portuguese', sqlc.arg('nome')::text)
;
