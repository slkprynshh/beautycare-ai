.PHONY: help dev test lint typecheck migrate seed docker-up docker-down

help:
	@echo "Available commands:"
	@echo "  make dev         - Run development server with uvicorn"
	@echo "  make test        - Run pytest suite"
	@echo "  make lint        - Run ruff linter"
	@echo "  make typecheck   - Run mypy type checker"
	@echo "  make migrate     - Run database migrations with alembic"
	@echo "  make seed        - Populate test database with realistic salon data"
	@echo "  make docker-up   - Start full stack via docker-compose"
	@echo "  make docker-down - Stop docker-compose services"

dev:
	uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

test:
	pytest -v tests/

lint:
	ruff check app/ tests/

typecheck:
	mypy app/

migrate:
	alembic upgrade head

seed:
	python -m scripts.seed

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down
