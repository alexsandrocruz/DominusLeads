-- name: CreateQualificacaoSocio :exec
INSERT INTO qualificacoes_de_socios (
    codigo,
    descricao
) VALUES (
    $1, $2
);

-- name: CreateQualificacaoSocioBatch :batchexec
INSERT INTO qualificacoes_de_socios (
    codigo,
    descricao
) VALUES (
    $1, $2
);
