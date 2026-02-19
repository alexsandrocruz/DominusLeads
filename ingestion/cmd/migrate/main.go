package main

import (
	"errors"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/alexsandrocruz/DominusLeads/ingestion/pkg/repository/sql"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
)

func main() {
	_ = godotenv.Load()

	rootCmd := &cobra.Command{
		Use:   "migrate",
		Short: "Database migration tool",
	}

	rootCmd.AddCommand(upCmd())
	rootCmd.AddCommand(downCmd())
	rootCmd.AddCommand(versionCmd())
	rootCmd.AddCommand(forceCmd())

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func getMigrate() (*migrate.Migrate, error) {
	postgresUser := os.Getenv("POSTGRES_USER")
	postgresPassword := os.Getenv("POSTGRES_PASSWORD")
	postgresHost := os.Getenv("POSTGRES_HOST")
	postgresPort := os.Getenv("POSTGRES_PORT")
	postgresDb := os.Getenv("POSTGRES_DB")

	if postgresUser == "" || postgresPassword == "" || postgresHost == "" || postgresPort == "" || postgresDb == "" {
		return nil, errors.New("database environment variables not set")
	}

	databaseUrl := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", postgresUser, postgresPassword, postgresHost, postgresPort, postgresDb)

	d, err := iofs.New(sql.SchemasFS, "schemas")
	if err != nil {
		return nil, err
	}

	return migrate.NewWithSourceInstance("iofs", d, databaseUrl)
}

func upCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "up [n]",
		Short: "Migrate up to the latest version or by n steps",
		Args:  cobra.MaximumNArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			m, err := getMigrate()
			if err != nil {
				log.Fatalf("could not init migrate: %v", err)
			}
			defer m.Close()

			if len(args) > 0 {
				n, err := strconv.Atoi(args[0])
				if err != nil {
					log.Fatalf("invalid number of steps: %v", err)
				}
				err = m.Steps(n)
				if err != nil && !errors.Is(err, migrate.ErrNoChange) {
					log.Fatalf("migration failed: %v", err)
				}
			} else {
				err = m.Up()
				if err != nil && !errors.Is(err, migrate.ErrNoChange) {
					log.Fatalf("migration failed: %v", err)
				}
			}
			fmt.Println("Migration up finished successfully")
		},
	}
}

func downCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "down [n]",
		Short: "Migrate down by n steps",
		Args:  cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			m, err := getMigrate()
			if err != nil {
				log.Fatalf("could not init migrate: %v", err)
			}
			defer m.Close()

			n, err := strconv.Atoi(args[0])
			if err != nil {
				log.Fatalf("invalid number of steps: %v", err)
			}
			err = m.Steps(-n)
			if err != nil && !errors.Is(err, migrate.ErrNoChange) {
				log.Fatalf("migration failed: %v", err)
			}
			fmt.Println("Migration down finished successfully")
		},
	}
}

func versionCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "version",
		Short: "Print the current migration version",
		Run: func(cmd *cobra.Command, args []string) {
			m, err := getMigrate()
			if err != nil {
				log.Fatalf("could not init migrate: %v", err)
			}
			defer m.Close()

			version, dirty, err := m.Version()
			if err != nil {
				if errors.Is(err, migrate.ErrNilVersion) {
					fmt.Println("No migrations applied yet")
					return
				}
				log.Fatalf("could not get version: %v", err)
			}

			fmt.Printf("Current version: %d (dirty: %v)\n", version, dirty)
		},
	}
}

func forceCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "force <version>",
		Short: "Force migration to a specific version (to fix dirty state)",
		Args:  cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			m, err := getMigrate()
			if err != nil {
				log.Fatalf("could not init migrate: %v", err)
			}
			defer m.Close()

			v, err := strconv.Atoi(args[0])
			if err != nil {
				log.Fatalf("invalid version: %v", err)
			}

			err = m.Force(v)
			if err != nil {
				log.Fatalf("force failed: %v", err)
			}
			fmt.Printf("Forced to version %d\n", v)
		},
	}
}
