-- name: GetEstabelecimentosAtivosByMunicipioAndCnae :many
SELECT * FROM estabelecimentos_ativos WHERE municipio = sqlc.arg(municipio)::text AND cnaes @> sqlc.arg(cnaes)::text[] LIMIT 10;