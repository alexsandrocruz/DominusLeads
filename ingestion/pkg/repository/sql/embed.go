package sql

import "embed"

//go:embed schemas/*.sql
var SchemasFS embed.FS
