# Derived from official mysql image (our base image)
FROM mysql:8.0.21

# Add a database

ENV MYSQL_DATABASE monitoringdieti

# Add the content of the sql-scripts/ directory to your image
# All scripts in docker-entrypoint-initdb.d/ are automatically
# executed during container startup

ADD my.cnf /etc/mysql

COPY ./database.sql /docker-entrypoint-initdb.d/
