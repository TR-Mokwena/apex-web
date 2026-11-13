package database

import (
	"context"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5"
)

// Tenant represents a registered Apex tenant.
type Tenant struct {
	ID         string
	Name       string
	Slug       string
	SchemaName string
	Status     string
}

// CreateTenant registers a tenant and creates its PostgreSQL schema.
func (db *Database) CreateTenant(
	ctx context.Context,
	name string,
	slug string,
) (*Tenant, error) {

	// 1. Input validation.
	name = strings.TrimSpace(name)
	slug = strings.TrimSpace(slug)

	if name == "" {
		return nil, fmt.Errorf("tenant name cannot be empty")
	}

	if slug == "" {
		return nil, fmt.Errorf("tenant slug cannot be empty")
	}

	// 2. Start a database transaction.
	tx, err := db.Pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("could not start tenant transaction: %w", err)
	}

	// If we return before committing, roll back the transaction.
	defer tx.Rollback(ctx)

	// 3. Insert the tenant and generate its schema name.
	tenant := &Tenant{}

	err = tx.QueryRow(ctx, `
		WITH new_tenant AS (
			SELECT gen_random_uuid() AS id
		)
		INSERT INTO public.tenants (
			id,
			name,
			slug,
			schema_name,
			status
		)
		SELECT
			id,
			$1,
			$2,
			'tenant_' || replace(id::text, '-', ''),
			'provisioning'
		FROM new_tenant
		RETURNING
			id::text,
			name,
			slug,
			schema_name,
			status
	`,
		name,
		slug,
	).Scan(
		&tenant.ID,
		&tenant.Name,
		&tenant.Slug,
		&tenant.SchemaName,
		&tenant.Status,
	)

	if err != nil {
		return nil, fmt.Errorf("could not register tenant: %w", err)
	}

	// 4. Safely create the tenant's PostgreSQL schema.
	// Sanitize quotes the identifier correctly.
	safeSchemaName := pgx.Identifier{tenant.SchemaName}.Sanitize()

	_, err = tx.Exec(ctx, "CREATE SCHEMA "+safeSchemaName)
	if err != nil {
		return nil, fmt.Errorf("could not create tenant schema: %w", err)
	}

	// 5. Mark the tenant as active.
	_, err = tx.Exec(ctx, `
		UPDATE public.tenants
		SET
			status = 'active',
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
	`, tenant.ID)

	if err != nil {
		return nil, fmt.Errorf("could not activate tenant: %w", err)
	}

	// 6. Commit the transaction.
	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("could not commit tenant creation: %w", err)
	}

	tenant.Status = "active"

	return tenant, nil
}
