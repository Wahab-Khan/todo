# Makefile for todo-backend

# ==========================================
# Database Commands (Mac / Local Installation)
# ==========================================
db-start-local:
	@echo "Starting local Postgres (Homebrew)..."
	brew services start postgresql

db-stop-local:
	@echo "Stopping local Postgres (Homebrew)..."
	brew services stop postgresql

# ==========================================
# Database Commands (Docker)
# ==========================================
db-start-docker:
	@echo "Starting Postgres via Docker..."
	docker start todo-postgres || docker run --name todo-postgres -e POSTGRES_USER=awkhan -e POSTGRES_HOST_AUTH_METHOD=trust -e POSTGRES_DB=todo_db -p 5432:5432 -d postgres

db-stop-docker:
	@echo "Stopping Postgres Docker container..."
	docker stop todo-postgres

db-rm-docker:
	@echo "Removing Postgres Docker container..."
	docker rm todo-postgres

# ==========================================
# Explore Database & Tables (Terminal)
# ==========================================
db-shell:
	@echo "Connecting to the database via psql..."
	@echo "Tip: Use '\l' to list databases, '\dt' to list tables, and '\d tablename' for table schema."
	psql -U awkhan -d todo_db

# ==========================================
# View Data in Browser (UI)
# ==========================================
db-ui:
	@echo "Opening Prisma Studio to view data in the browser..."
	npx prisma studio

# (Alias for db-ui)
studio: db-ui

# ==========================================
# Prisma Migrations & Schema
# ==========================================
migrate:
	@echo "Running Prisma migrations..."
	npx prisma migrate dev

migrate-status:
	@echo "Checking migration status..."
	npx prisma migrate status

generate:
	@echo "Generating Prisma Client..."
	npx prisma generate

# ==========================================
# Project Execution Commands
# ==========================================
dev:
	@echo "Starting development server (watch mode)..."
	node --import tsx --watch src/server.ts

build:
	@echo "Building the project..."
	npm run build

start:
	@echo "Starting the built project..."
	npm start

install:
	npm install

.PHONY: db-start-local db-stop-local db-start-docker db-stop-docker db-rm-docker db-shell db-ui studio migrate migrate-status generate dev build start install
