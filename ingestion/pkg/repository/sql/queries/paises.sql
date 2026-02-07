-- name: CreatePais :exec
INSERT INTO paises (
    codigo,
    descricao
) VALUES (
    $1, $2
);

-- name: CreatePaisBatch :batchexec
INSERT INTO paises (
    codigo,
    descricao
) VALUES (
    $1, $2
);
