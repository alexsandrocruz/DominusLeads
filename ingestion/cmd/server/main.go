package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"os"

	"github.com/alexsandrocruz/DominusLeads/ingestion/pkg/api"
	"github.com/alexsandrocruz/DominusLeads/ingestion/pkg/repository"
	"github.com/getkin/kin-openapi/openapi3filter"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	middleware "github.com/oapi-codegen/nethttp-middleware"
	"github.com/swaggest/swgui/v5emb"
)

func main() {
	_ = godotenv.Load()
	ctx := context.Background()

	spec, _ := api.GetSwagger()
	spec.Servers = nil

	mux := http.NewServeMux()

	potsgresUser := os.Getenv("POSTGRES_USER")
	potsgresPassword := os.Getenv("POSTGRES_PASSWORD")
	potsgresHost := os.Getenv("POSTGRES_HOST")
	potsgresPort := os.Getenv("POSTGRES_PORT")
	potsgresDb := os.Getenv("POSTGRES_DB")
	databaseUrl := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", potsgresUser, potsgresPassword, potsgresHost, potsgresPort, potsgresDb)

	dbpool, err := pgxpool.New(ctx, databaseUrl)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer dbpool.Close()
	r := repository.New(dbpool)

	server := api.NewServer(r)

	mux.Handle("/openapi.yml", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/yaml")
		w.Write(api.SwaggetSpec())
	}))

	mux.Handle("/doc/", v5emb.New(
		"SGD",
		"/openapi.yml",
		"/doc/",
	))

	strictHandler := api.NewStrictHandlerWithOptions(server, nil, api.StrictHTTPServerOptions{
		RequestErrorHandlerFunc: func(w http.ResponseWriter, r *http.Request, err error) {
			log.Printf("request error: %v", err)
			w.WriteHeader(http.StatusBadRequest)
		},
		ResponseErrorHandlerFunc: func(w http.ResponseWriter, r *http.Request, err error) {
			log.Printf("response error: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
		},
	})

	apiHandler := api.HandlerWithOptions(strictHandler, api.StdHTTPServerOptions{
		// BaseURL: "/api/v1",
		// BaseRouter: mux,
		Middlewares: []api.MiddlewareFunc{
			middleware.OapiRequestValidatorWithOptions(spec, &middleware.Options{
				Options: openapi3filter.Options{
					AuthenticationFunc: func(ctx context.Context, ai *openapi3filter.AuthenticationInput) error {
						fmt.Printf("authenticationInput: %v\n", ai)
						fmt.Printf("authentication to be tested: %v\n", ai.SecuritySchemeName)
						fmt.Printf("headers: %v\n", ai.RequestValidationInput.Request.Header)
						return nil
					},
				},
			}),
		},
	})

	mux.Handle("/api/v1/", http.StripPrefix("/api/v1", apiHandler))

	addr := os.Getenv("SERVER_ADDR")
	if addr == "" {
		addr = ":8088"
	}

	s := &http.Server{
		Addr:    addr,
		Handler: mux,
	}

	log.Printf("listening on %s", addr)
	if err := s.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
