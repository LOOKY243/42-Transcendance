NAME = 42-transcendance

all: build up

build:
	@mkdir -p ~/data/postgres
	@mkdir -p ~/data/django
	@docker compose -p $(NAME) build

up:
	@docker compose -p $(NAME) up

down:
	@docker compose -p $(NAME) down

clean: down
	@sudo rm -rf ~/data/postgres
	@sudo rm -rf ~/data/django
	@docker volume rm 42-transcendance_postgres
	# @docker volume rm 42-transcendance_django
	@docker rmi $$(docker images -a -q) -f
	@docker system prune -f -a --volumes

re: clean up

.PHONY: all build up down clean re
