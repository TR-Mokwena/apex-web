package database

import (
	"context"
	"fmt"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"

	"github.com/TR-Mokwena/apex-web/backend/internal/config"
)

func TestCreateTenant(t *testing.T) {
	// 1. Load the backend .env file.
	// Go tests run from the package directory, so we go up
	// two folders to reach backend/.env.
	if err := godotenv.Load("../../.env"); err != nil {
		t.Fatalf("could not load backend .env file: %v", err)
	}

	// 2. Read the database configuration.
	cfg := &config.Config{
		DBHost:     os.Getenv("DB_HOST"),
		DBPort:     os.Getenv("DB_PORT"),
		DBName:     os.Getenv("DB_NAME"),
		DBUser:     os.Getenv("DB_USER"),
		DBPassword: os.Getenv("DB_PASSWORD"),
	}

	// 3. Connect to PostgreSQL.
	db, err := New(cfg)
	if err != nil {
		t.Fatalf("could not connect to database: %v", err)
	}

	t.Cleanup(func() {
		db.Pool.Close()
	})

	if err := db.Ping(); err != nil {
		t.Fatalf("database ping failed: %v", err)
	}

	// 4. Prepare a context with a timeout.
	ctx, cancel := context.WithTimeout(
		context.Background(),
		15*time.Second,
	)
	defer cancel()

	// 5. Generate a unique test tenant slug.
	slug := fmt.Sprintf("test-tenant-%d", time.Now().UnixNano())

	// 6. Create the tenant.
	tenant, err := db.CreateTenant(
		ctx,
		"Apex Test Tenant",
		slug,
	)
	if err != nil {
		t.Fatalf("tenant creation failed: %v", err)
	}

	// 7. Register cleanup for this test tenant.
	// This removes only the tenant created by this test.
	t.Cleanup(func() {
		cleanupCtx, cleanupCancel := context.WithTimeout(
			context.Background(),
			10*time.Second,
		)
		defer cleanupCancel()

		safeSchemaName := pgx.Identifier{tenant.SchemaName}.Sanitize()

		if _, err := db.Pool.Exec(
			cleanupCtx,
			"DROP SCHEMA IF EXISTS "+safeSchemaName+" CASCADE",
		); err != nil {
			t.Errorf("could not remove test schema: %v", err)
		}

		if _, err := db.Pool.Exec(
			cleanupCtx,
			"DELETE FROM public.tenants WHERE id = $1",
			tenant.ID,
		); err != nil {
			t.Errorf("could not remove test tenant: %v", err)
		}
	})

	// 8. Check the returned tenant information.
	if tenant.Name != "Apex Test Tenant" {
		t.Errorf("unexpected tenant name: %s", tenant.Name)
	}

	if tenant.Slug != slug {
		t.Errorf("unexpected tenant slug: %s", tenant.Slug)
	}

	if !strings.HasPrefix(tenant.SchemaName, "tenant_") {
		t.Errorf("invalid schema name: %s", tenant.SchemaName)
	}

	if tenant.Status != "active" {
		t.Errorf("expected active status, got: %s", tenant.Status)
	}

	// 9. Verify that the schema exists in PostgreSQL.
	var schemaExists bool

	err = db.Pool.QueryRow(
		ctx,
		`SELECT EXISTS (
			SELECT 1
			FROM pg_namespace
			WHERE nspname = $1
		)`,
		tenant.SchemaName,
	).Scan(&schemaExists)

	if err != nil {
		t.Fatalf("could not check tenant schema: %v", err)
	}

	if !schemaExists {
		t.Errorf("tenant schema does not exist: %s", tenant.SchemaName)
	}

	// 10. Verify the tenant was saved as active.
	var savedStatus string

	err = db.Pool.QueryRow(
		ctx,
		`SELECT status
		 FROM public.tenants
		 WHERE id = $1`,
		tenant.ID,
	).Scan(&savedStatus)

	if err != nil {
		t.Fatalf("could not retrieve saved tenant: %v", err)
	}

	if savedStatus != "active" {
		t.Errorf("expected database status active, got: %s", savedStatus)
	}
}
