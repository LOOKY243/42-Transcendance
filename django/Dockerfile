FROM python:3.12

RUN apt-get update -y && apt-get upgrade -y

RUN apt-get install -y \
    libpq-dev \
    build-essential

RUN mkdir transcendence
WORKDIR /transcendence

COPY requirements.txt /transcendence/.
RUN pip install --no-cache-dir -r requirements.txt

RUN pwd

COPY workspace /transcendence/
COPY script.sh /transcendence/.
RUN chmod +x /transcendence/script.sh

CMD ["/transcendence/script.sh"]