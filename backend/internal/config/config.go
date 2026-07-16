package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	AppName    string
	AppEnv     string
	AppPort    string
	DBHost     string
	DBPort     string
	DBName     string
	DBUser     string
	DBPassword string
	JWTSecret  string
	LogLevel   string
}

func Load() *Config {

	err := godotenv.Load()

	if err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	cfg := &Config{
		AppName: os.Getenv("APP_NAME"),
		AppEnv:  os.Getenv("APP_ENV"),
		AppPort: os.Getenv("APP_PORT"),

		DBHost:     os.Getenv("DB_HOST"),
		DBPort:     os.Getenv("DB_PORT"),
		DBName:     os.Getenv("DB_NAME"),
		DBUser:     os.Getenv("DB_USER"),
		DBPassword: os.Getenv("DB_PASSWORD"),

		JWTSecret: os.Getenv("JWT_SECRET"),

		LogLevel: os.Getenv("LOG_LEVEL"),
	}

	return cfg
}

func require(value string, name string) {
	if value == "" {
		log.Fatalf("%s environment variable is required", name)
	}
}
