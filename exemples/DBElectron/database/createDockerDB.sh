#!/bin/bash

DDB_RUN=0;
DDB_INSTALLED=0;

2>/dev/null

[ `docker ps -f name=mysqlCine | wc -l` -ne 1 ] && DDB_RUN=1;

[ `docker ps -af name=mysqlCine | wc -l` -ne 1 ] && DDB_INSTALLED=1;


wait_for_docker_running(){
    while ! mysqladmin ping -h 127.0.0.1 --port=3308 --silent; do
        echo -n ".";
        sleep 3
    done
}

run_mysql_script(){
    mysql -h 127.0.0.1 -u root -proot --port=3308 < ./DBCine.sql
}

# If Docker image is not created, then create it
echo "Checking for previous docker container created for DBCine..."
if [ $DDB_INSTALLED -ne 1 ]; then
    echo "DBCine docker not created, creating it..."
    docker run  --name mysqlCine \
                -p 3308:3306 \
                -e MYSQL_ROOT_PASSWORD="root" \
                -d mysql --default-authentication-plugin=mysql_native_password
                # If we want persistence, just uncomment
                # -v /srv/mysql:/var/lib/mysql
                run_mysql_script

    echo "";
    echo -n "Waiting for DBCine Docker will be ready"
    wait_for_docker_running
    echo "DBCine container is running... creating database"
    run_mysql_script
    echo "Done."
elif [ $DDB_RUN -ne 1 ]; then
    echo "DBCine container created yet, running it..."
    docker start mysqlCine
else
    echo "DBCine is running yet"
fi
