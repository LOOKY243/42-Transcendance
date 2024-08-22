set -e

# Initialize variables from environment
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
USER_PASSWORD=${DB_PASS}

# Create the database and user
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE "$DB_NAME";
    CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
    ALTER DATABASE "$DB_NAME" OWNER TO $DB_USER;
    GRANT ALL PRIVILEGES ON DATABASE "$DB_NAME" TO $DB_USER;
EOSQL