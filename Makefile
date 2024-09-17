NAME = 42-transcendance
COMPOSE = docker-compose.yml

all: build up

build:
	@mkdir -p data/postgres
	@mkdir -p data/django
	@docker compose -p $(NAME) -f $(COMPOSE) build

up: 
	@docker compose -p $(NAME) -f $(COMPOSE) up

down:
	@docker compose -p $(NAME) -f $(COMPOSE) down

clean: down
	rm -rf data/postgres
	rm -rf data/django
	@docker volume rm 42-transcendance_postgres || true
	@docker volume rm 42-transcendance_django || true

re: clean all

.PHONY: all build up down clean re
