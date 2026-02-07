package api

import (
	"context"

	"github.com/alexsandrocruz/DominusLeads/ingestion/pkg/repository"
	"github.com/jackc/pgx/v5/pgtype"
	openapi_types "github.com/oapi-codegen/runtime/types"
)

type Server struct {
	queries *repository.Queries
}

func NewServer(queries *repository.Queries) *Server {
	return &Server{queries: queries}
}

// Get establishments
// (GET /estabelecimentos-ativos)
func (s *Server) GetEstabelecimentosAtivos(ctx context.Context, req GetEstabelecimentosAtivosRequestObject) (GetEstabelecimentosAtivosResponseObject, error) {
	params := repository.GetEstabelecimentosAtivosByMunicipioAndCnaeParams{
		Municipio: req.Params.Municipio,
		Cnaes:     []string{req.Params.Cnae},
	}
	result, err := s.queries.GetEstabelecimentosAtivosByMunicipioAndCnae(ctx, params)
	if err != nil {
		return GetEstabelecimentosAtivos500JSONResponse(Error{
			Message: "não foi possível obter os estabelecimentos devido a um erro interno",
		}), err
	}
	var estabelecimentos []EstabelecimentosAtivo
	for _, e := range result {
		estabelecimentos = append(estabelecimentos, ToEstabelecimentosAtivo(e))
	}
	return GetEstabelecimentosAtivos200JSONResponse(estabelecimentos), nil
}

func ToEstabelecimentosAtivo(e repository.EstabelecimentosAtivo) EstabelecimentosAtivo {
	return EstabelecimentosAtivo{
		CnpjBasico:                stringPtr(e.CnpjBasico),
		CnpjOrdem:                 stringPtr(e.CnpjOrdem),
		CnpjDv:                    stringPtr(e.CnpjDv),
		IdentificadorMatrizFilial: textPtr(e.IdentificadorMatrizFilial),
		NomeFantasia:              textPtr(e.NomeFantasia),
		SituacaoCadastral:         textPtr(e.SituacaoCadastral),
		DataSituacaoCadastral:     datePtr(e.DataSituacaoCadastral),
		MotivoSituacaoCadastral:   textPtr(e.MotivoSituacaoCadastral),
		NomeCidadeExterior:        textPtr(e.NomeCidadeExterior),
		Pais:                      textPtr(e.Pais),
		DataInicioAtividade:       datePtr(e.DataInicioAtividade),
		Cnaes:                     cnaesPtr(e.Cnaes),
		TipoLogradouro:            textPtr(e.TipoLogradouro),
		Logradouro:                textPtr(e.Logradouro),
		Numero:                    textPtr(e.Numero),
		Complemento:               textPtr(e.Complemento),
		Bairro:                    textPtr(e.Bairro),
		Cep:                       textPtr(e.Cep),
		Uf:                        textPtr(e.Uf),
		Municipio:                 textPtr(e.Municipio),
		Ddd1:                      textPtr(e.Ddd1),
		Telefone1:                 textPtr(e.Telefone1),
		Ddd2:                      textPtr(e.Ddd2),
		Telefone2:                 textPtr(e.Telefone2),
		DddFax:                    textPtr(e.DddFax),
		Fax:                       textPtr(e.Fax),
		CorreioEletronico:         textPtr(e.CorreioEletronico),
		SituacaoEspecial:          textPtr(e.SituacaoEspecial),
		DataSituacaoEspecial:      datePtr(e.DataSituacaoEspecial),
	}
}

func stringPtr(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

func textPtr(t pgtype.Text) *string {
	if !t.Valid {
		return nil
	}
	return &t.String
}

func datePtr(d pgtype.Date) *openapi_types.Date {
	if !d.Valid {
		return nil
	}
	return &openapi_types.Date{Time: d.Time}
}

func cnaesPtr(c interface{}) *[]string {
	if c == nil {
		return nil
	}
	v, ok := c.([]string)
	if !ok {
		return nil
	}
	return &v
}
