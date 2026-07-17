package main

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/TR-Mokwena/apex-web/backend/internal/config"

	"github.com/TR-Mokwena/apex-web/backend/pkg/database"
)

func main() {
	cfg := config.Load()

	fmt.Println("Application:", cfg.AppName)
	fmt.Println("Environment:", cfg.AppEnv)
	fmt.Println("Port:", cfg.AppPort)
	fmt.Println("Database:", cfg.DBName)

	// Connect to the database FIRST
	db, err := database.New(cfg)
	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	defer db.Pool.Close()

	fmt.Println("Successfully connected to PostgreSQL")

	// Create router
	r := chi.NewRouter()

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, "Apex API Healthy")
	})

	fmt.Printf("Server running on :%s\n", cfg.AppPort)

	err = http.ListenAndServe(":"+cfg.AppPort, r)
	if err != nil {
		panic(err)
	}
}
