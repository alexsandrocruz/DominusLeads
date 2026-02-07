-- name: CreateMunicipio :exec
INSERT INTO municipios (
    codigo,
    descricao
) VALUES (
    $1, $2
);

-- name: CreateMunicipioBatch :batchexec
INSERT INTO municipios (
    codigo,
    descricao
) VALUES (
    $1, $2
);
