NAME = 42-transcendance
COMPOSE = docker-compose.yml
COMPOSE_BACK = docker-compose.backend.yml

all: build up

cert:
	@mkdir -p nginx/cert
	@openssl req -x509 -newkey rsa:2048 -keyout nginx/cert/transcendance.key -out nginx/cert/transcendance.crt -days 365 -nodes -subj "/C=FR/ST=FRANCE/L=ANGOULEME/CN=KBUTOR-B"

volume:
	@mkdir -p data/postgres
	@mkdir -p data/django

build: volume cert
	@docker compose -p $(NAME) -f $(COMPOSE) build

up: 
	@docker compose -p $(NAME) -f $(COMPOSE) up

down:
	@docker compose -p $(NAME) -f $(COMPOSE) down

clean: down
	rm -rf data/postgres
	rm -rf data/django
	rm -rf nginx/cert
	@docker volume rm 42-transcendance_postgres || true
	@docker volume rm 42-transcendance_django || true
	@docker volume rm 42-transcendance_nginx || true
	

re: clean all

back: clean volume
	@docker compose -p $(NAME) -f $(COMPOSE_BACK) build
	@docker compose -p $(NAME) -f $(COMPOSE_BACK) up

.PHONY: volume all build up down clean re back

