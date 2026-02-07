DATABASE_URI := "postgres://postgres:postgres@localhost:5432/dominus_leads?sslmode=disable"

DATABASE_MIGRATE_PATH := "./ingestion/pkg/repository/sql/schemas"

BUILD_DIR := "./_build"

.PHONY: migrate-up
migrate-up:
	migrate -path $(DATABASE_MIGRATE_PATH) -database $(DATABASE_URI) up

.PHONY: migrate-down
migrate-down:
	migrate -path $(DATABASE_MIGRATE_PATH) -database $(DATABASE_URI) down

.PHONY: migrate-create
migrate-create:
	migrate create -ext sql -dir $(DATABASE_MIGRATE_PATH) $(MIGRATE_NAME)

.PHONY: generate
generate:
	go generate ./...

.PHONY: build
build:
	go build -o $(BUILD_DIR)/ingestion ./ingestion/cmd/ingestion
	go build -o $(BUILD_DIR)/server ./ingestion/cmd/server
	go build -o $(BUILD_DIR)/migrate ./ingestion/cmd/migrate

.PHONY: deploy
deploy:
	scp $(BUILD_DIR)/* fernando@dominusleads.local:~/