FROM python:3.12

RUN apt-get update -y && apt-get upgrade -y

RUN apt-get install -y \
    libpq-dev \
    build-essential \
    postgresql-client

RUN mkdir transcendence
WORKDIR /transcendence

COPY requirements.txt /transcendence/.
RUN pip install --no-cache-dir -r requirements.txt

COPY workspace/ .
COPY script.sh .

RUN chmod +x script.sh

CMD ["bash", "/transcendence/script.sh"]

