FROM postgres:15

ENV POSTGRES_DB=mydatabase
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=mypassword

COPY script.sh /docker-entrypoint-initdb.d/

EXPOSE 5432
