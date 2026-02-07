package main

import (
	"archive/zip"
	"context"
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/alexsandrocruz/DominusLeads/ingestion/pkg/repository"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/joho/godotenv"
	"golang.org/x/text/encoding/charmap"
	"golang.org/x/text/transform"
)

const BATCH_SIZE = 10000

func main() {
	_ = godotenv.Load()
	ctx := context.Background()

	potsgresUser := os.Getenv("POSTGRES_USER")
	potsgresPassword := os.Getenv("POSTGRES_PASSWORD")
	potsgresHost := os.Getenv("POSTGRES_HOST")
	potsgresPort := os.Getenv("POSTGRES_PORT")
	potsgresDb := os.Getenv("POSTGRES_DB")
	databaseUrl := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", potsgresUser, potsgresPassword, potsgresHost, potsgresPort, potsgresDb)

	conn, err := pgx.Connect(ctx, databaseUrl)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer conn.Close(ctx)
	r := repository.New(conn)

	filesDir := os.Getenv("FILES_DIR")
	if filesDir == "" {
		filesDir = "./ingestion/files"
	}

	// ingestPaises(ctx, r, filesDir)
	// ingestMunicipios(ctx, r, filesDir)
	// ingestQualificacoesDeSocios(ctx, r, filesDir)
	// ingestNaturezasJuridicas(ctx, r, filesDir)
	// ingestCnaes(ctx, r, filesDir)
	// ingestMotivos(ctx, r, filesDir)
	// ingestSimples(ctx, r, filesDir)
	ingestEmpresas(ctx, r, filesDir)
	ingestEstabelecimentos(ctx, r, filesDir)
	ingestSocios(ctx, r, filesDir)

	log.Println("Ingestion completed!")
}

func parseDate(s string) pgtype.Date {
	if s == "" || s == "00000000" {
		return pgtype.Date{Valid: false}
	}
	t, err := time.Parse("20060102", s)
	if err != nil {
		return pgtype.Date{Valid: false}
	}
	return pgtype.Date{Time: t, Valid: true}
}

func parseText(s string) pgtype.Text {
	s = sanitize(s)
	return pgtype.Text{String: s, Valid: s != ""}
}

func sanitize(s string) string {
	return strings.ReplaceAll(s, "\x00", "")
}

func ingestPaises(ctx context.Context, r *repository.Queries, filesDir string) {
	log.Println("Ingesting Paises...")
	processSimpleZip(ctx, filepath.Join(filesDir, "Paises.zip"), func(record []string) repository.CreatePaisBatchParams {
		return repository.CreatePaisBatchParams{
			Codigo:    sanitize(record[0]),
			Descricao: parseText(record[1]),
		}
	}, r.CreatePaisBatch)
}

func ingestMunicipios(ctx context.Context, r *repository.Queries, filesDir string) {
	log.Println("Ingesting Municipios...")
	processSimpleZip(ctx, filepath.Join(filesDir, "Municipios.zip"), func(record []string) repository.CreateMunicipioBatchParams {
		return repository.CreateMunicipioBatchParams{
			Codigo:    sanitize(record[0]),
			Descricao: parseText(record[1]),
		}
	}, r.CreateMunicipioBatch)
}

func ingestQualificacoesDeSocios(ctx context.Context, r *repository.Queries, filesDir string) {
	log.Println("Ingesting Qualificacoes de Socios...")
	processSimpleZip(ctx, filepath.Join(filesDir, "Qualificacoes.zip"), func(record []string) repository.CreateQualificacaoSocioBatchParams {
		return repository.CreateQualificacaoSocioBatchParams{
			Codigo:    sanitize(record[0]),
			Descricao: parseText(record[1]),
		}
	}, r.CreateQualificacaoSocioBatch)
}

func ingestNaturezasJuridicas(ctx context.Context, r *repository.Queries, filesDir string) {
	log.Println("Ingesting Naturezas Juridicas...")
	processSimpleZip(ctx, filepath.Join(filesDir, "Naturezas.zip"), func(record []string) repository.CreateNaturezaJuridicaBatchParams {
		return repository.CreateNaturezaJuridicaBatchParams{
			Codigo:    sanitize(record[0]),
			Descricao: parseText(record[1]),
		}
	}, r.CreateNaturezaJuridicaBatch)
}

func ingestCnaes(ctx context.Context, r *repository.Queries, filesDir string) {
	log.Println("Ingesting CNAEs...")
	processSimpleZip(ctx, filepath.Join(filesDir, "Cnaes.zip"), func(record []string) repository.CreateCnaeBatchParams {
		return repository.CreateCnaeBatchParams{
			Codigo:    sanitize(record[0]),
			Descricao: parseText(record[1]),
		}
	}, r.CreateCnaeBatch)
}

func ingestMotivos(ctx context.Context, r *repository.Queries, filesDir string) {
	log.Println("Ingesting Motivos...")
	processSimpleZip(ctx, filepath.Join(filesDir, "Motivos.zip"), func(record []string) repository.CreateMotivoBatchParams {
		return repository.CreateMotivoBatchParams{
			Codigo:    sanitize(record[0]),
			Descricao: parseText(record[1]),
		}
	}, r.CreateMotivoBatch)
}

func ingestSimples(ctx context.Context, r *repository.Queries, filesDir string) {
	log.Println("Ingesting Simples...")
	processSimpleZip(ctx, filepath.Join(filesDir, "Simples.zip"), func(record []string) repository.CreateSimplesBatchParams {
		return repository.CreateSimplesBatchParams{
			CnpjBasico:            sanitize(record[0]),
			OpcaoPeloSimples:      parseText(record[1]),
			DataOpcaoPeloSimples:  parseDate(record[2]),
			DataExclusaoDoSimples: parseDate(record[3]),
			OpcaoPeloMei:          parseText(record[4]),
			DataOpcaoPeloMei:      parseDate(record[5]),
			DataExclusaoDoMei:     parseDate(record[6]),
		}
	}, r.CreateSimplesBatch)
}

func ingestEmpresas(ctx context.Context, r *repository.Queries, filesDir string) {
	log.Println("Ingesting Empresas...")
	processIndexedZips(ctx, filepath.Join(filesDir, "Empresas%d.zip"), func(record []string) repository.CreateEmpresaBatchParams {
		capitalSocial := pgtype.Numeric{}
		capitalSocial.Scan(record[4])
		return repository.CreateEmpresaBatchParams{
			CnpjBasico:                sanitize(record[0]),
			RazaoSocial:               parseText(record[1]),
			NaturezaJuridica:          parseText(record[2]),
			QualificacaoResponsavel:   parseText(record[3]),
			CapitalSocial:             capitalSocial,
			Porte:                     parseText(record[5]),
			EnteFederativoResponsavel: parseText(record[6]),
		}
	}, r.CreateEmpresaBatch)
}

func ingestEstabelecimentos(ctx context.Context, r *repository.Queries, filesDir string) {
	log.Println("Ingesting Estabelecimentos...")
	processIndexedZips(ctx, filepath.Join(filesDir, "Estabelecimentos%d.zip"), func(record []string) repository.CreateEstabelecimentoBatchParams {
		return repository.CreateEstabelecimentoBatchParams{
			CnpjBasico:                sanitize(record[0]),
			CnpjOrdem:                 sanitize(record[1]),
			CnpjDv:                    sanitize(record[2]),
			IdentificadorMatrizFilial: parseText(record[3]),
			NomeFantasia:              parseText(record[4]),
			SituacaoCadastral:         parseText(record[5]),
			DataSituacaoCadastral:     parseDate(record[6]),
			MotivoSituacaoCadastral:   parseText(record[7]),
			NomeCidadeExterior:        parseText(record[8]),
			Pais:                      parseText(record[9]),
			DataInicioAtividade:       parseDate(record[10]),
			CnaeFiscalPrincipal:       parseText(record[11]),
			CnaeFiscalSecundaria:      parseText(record[12]),
			TipoLogradouro:            parseText(record[13]),
			Logradouro:                parseText(record[14]),
			Numero:                    parseText(record[15]),
			Complemento:               parseText(record[16]),
			Bairro:                    parseText(record[17]),
			Cep:                       parseText(record[18]),
			Uf:                        parseText(record[19]),
			Municipio:                 parseText(record[20]),
			Ddd1:                      parseText(record[21]),
			Telefone1:                 parseText(record[22]),
			Ddd2:                      parseText(record[23]),
			Telefone2:                 parseText(record[24]),
			DddFax:                    parseText(record[25]),
			Fax:                       parseText(record[26]),
			CorreioEletronico:         parseText(record[27]),
			SituacaoEspecial:          parseText(record[28]),
			DataSituacaoEspecial:      parseDate(record[29]),
		}
	}, r.CreateEstabelecimentoBatch)
}

func ingestSocios(ctx context.Context, r *repository.Queries, filesDir string) {
	log.Println("Ingesting Socios...")
	processIndexedZips(ctx, filepath.Join(filesDir, "Socios%d.zip"), func(record []string) repository.CreateSocioBatchParams {
		return repository.CreateSocioBatchParams{
			CnpjBasico:                     parseText(record[0]),
			IdentificadorDeSocio:           parseText(record[1]),
			NomeSocio:                      parseText(record[2]),
			CnpjCpfSocio:                   parseText(record[3]),
			QualificacaoSocio:              parseText(record[4]),
			DataEntradaSociedade:           parseDate(record[5]),
			Pais:                           parseText(record[6]),
			RepresentanteLegal:             parseText(record[7]),
			NomeRepresentante:              parseText(record[8]),
			QualificacaoRepresentanteLegal: parseText(record[9]),
			FaixaEtaria:                    parseText(record[10]),
		}
	}, r.CreateSocioBatch)
}

func processSimpleZip[T any, R any](ctx context.Context, zipPath string, mapper func([]string) T, batcher func(context.Context, []T) R) {
	if _, err := os.Stat(zipPath); os.IsNotExist(err) {
		log.Printf("File not found: %s", zipPath)
		return
	}

	zr, err := zip.OpenReader(zipPath)
	if err != nil {
		log.Printf("failed to open zip file %s: %v", zipPath, err)
		return
	}
	defer zr.Close()

	for _, zf := range zr.File {
		rc, err := zf.Open()
		if err != nil {
			log.Printf("failed to open file %s inside zip: %v", zf.Name, err)
			continue
		}
		processCSV(ctx, rc, mapper, batcher)
		rc.Close()
	}
}

func processIndexedZips[T any, R any](ctx context.Context, zipPattern string, mapper func([]string) T, batcher func(context.Context, []T) R) {
	for i := 0; ; i++ {
		zipPath := fmt.Sprintf(zipPattern, i)
		if _, err := os.Stat(zipPath); os.IsNotExist(err) {
			break
		}

		zr, err := zip.OpenReader(zipPath)
		if err != nil {
			log.Printf("failed to open zip file %s: %v", zipPath, err)
			continue
		}

		for _, zf := range zr.File {
			rc, err := zf.Open()
			if err != nil {
				log.Printf("failed to open file %s inside zip: %v", zf.Name, err)
				continue
			}
			processCSV(ctx, rc, mapper, batcher)
			rc.Close()
		}
		zr.Close()
	}
}

type BatchExecutor interface {
	Exec(func(int, error))
}

func processCSV[T any, R any](ctx context.Context, rc io.Reader, mapper func([]string) T, batcher func(context.Context, []T) R) {
	csvReader := csv.NewReader(transform.NewReader(rc, charmap.ISO8859_1.NewDecoder()))
	csvReader.Comma = ';'
	csvReader.LazyQuotes = true

	batch := make([]T, 0, BATCH_SIZE)
	totalInserted := 0

	for {
		record, err := csvReader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Printf("error reading csv: %v", err)
			break
		}

		batch = append(batch, mapper(record))

		if len(batch) >= BATCH_SIZE {
			results := batcher(ctx, batch)
			if executer, ok := any(results).(BatchExecutor); ok {
				executer.Exec(func(i int, err error) {
					if err != nil {
						log.Printf("error inserting batch element %d: %v (%v)", i, err, batch[i])
					}
				})
			}
			totalInserted += len(batch)
			log.Printf("Inserted %d records...", totalInserted)
			batch = make([]T, 0, BATCH_SIZE)
		}
	}

	if len(batch) > 0 {
		results := batcher(ctx, batch)
		if executer, ok := any(results).(BatchExecutor); ok {
			executer.Exec(func(i int, err error) {
				if err != nil {
					log.Printf("error inserting final batch element %d: %v", i, err)
				}
			})
		}
		totalInserted += len(batch)
		log.Printf("Total inserted: %d", totalInserted)
	}
}
