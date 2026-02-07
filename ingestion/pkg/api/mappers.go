package api

import (
	"github.com/alexsandrocruz/DominusLeads/ingestion/pkg/repository"
	"github.com/jackc/pgx/v5/pgtype"
	openapi_types "github.com/oapi-codegen/runtime/types"
)

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

func ToCnae(c repository.Cnae) Cnae {
	return Cnae{
		Codigo:    stringPtr(c.Codigo),
		Descricao: textPtr(c.Descricao),
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
