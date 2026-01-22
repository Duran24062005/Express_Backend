#!/bin/bash
# init-db.sh - Script para inicializar la base de datos

echo "Waiting for MySQL to be ready..."
sleep 10

echo "Initializing database..."
mysql -h mysql -u root -p"$MYSQL_PASS" < /docker-entrypoint-initdb.d/init.sql

echo "Database initialized successfully!"
