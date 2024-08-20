FROM postgres:15

# Set environment variables
ENV POSTGRES_DB=mydatabase
ENV POSTGRES_USER=
ENV POSTGRES_PASSWORD=mypassword

# Copy any additional initialization scripts
COPY script.sh /docker-entrypoint-initdb.d/

# Expose the default PostgreSQL port
EXPOSE 5432
