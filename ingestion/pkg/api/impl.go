package api

import (
	"context"

	"github.com/alexsandrocruz/DominusLeads/ingestion/pkg/repository"
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

// Get CNAEs
// (GET /cnaes)
func (s *Server) GetCnaes(ctx context.Context, request GetCnaesRequestObject) (GetCnaesResponseObject, error) {
	result, err := s.queries.GetCnaesByDescricao(ctx, *request.Params.Nome)
	if err != nil {
		return GetCnaes500JSONResponse(Error{
			Message: "não foi possível obter os cnaes devido a um erro interno",
		}), err
	}
	var cnaes []Cnae
	for _, c := range result {
		cnaes = append(cnaes, ToCnae(c))
	}
	return GetCnaes200JSONResponse(cnaes), nil
}

// Get CNAE by code
// (GET /cnaes/{codigo})
func (s *Server) GetCnaesCodigo(ctx context.Context, request GetCnaesCodigoRequestObject) (GetCnaesCodigoResponseObject, error) {
	result, err := s.queries.GetCnaeByCodigo(ctx, request.Codigo)
	if err != nil {
		return GetCnaesCodigo500JSONResponse(Error{
			Message: "não foi possível obter o cnae devido a um erro interno",
		}), err
	}
	return GetCnaesCodigo200JSONResponse(ToCnae(result)), nil
}
