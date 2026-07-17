package database

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/TR-Mokwena/apex-web/backend/internal/config"
)

type Database struct {
	Pool *pgxpool.Pool
}

// connection func
func New(cfg *config.Config) (*Database, error) {
	connectionString := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s",
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBHost,
		cfg.DBPort,
		cfg.DBName,
	)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, connectionString)
	if err != nil {
		return nil, err
	}

	return &Database{
		Pool: pool,
	}, nil
}

// health check
func (db *Database) Ping() error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	return db.Pool.Ping(ctx)
}
