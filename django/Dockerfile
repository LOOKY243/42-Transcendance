FROM python:3.12

RUN apt-get update -y && apt-get upgrade -y

RUN apt-get install -y \
    libpq-dev \
    build-essential

RUN mkdir transcendence

COPY ft_django transcendence/.