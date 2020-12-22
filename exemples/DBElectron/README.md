# Exemple d'aplicació Electron d'accés a BD i comunicació IPC

## Posta en marxa de la BD

La BD d'aquest exemple es troba en un contenidor Docker. Per posar-la en marxa disposem d'un script a la carpeta `database` que automatitza la creació o posta en marxa d'aquesta al nostre ordinador.

Per tal de posar la BD en marxa, des de la carpeta `database`, invocarem l'script `createDockerDB.sh`.

La primera vegada que l'executem, tardarà un temps en descarregar les imatges de MySQL necessàries i posar la BD en marxa:

```
$ sudo ./createDockerDB.sh 
Checking for previous docker container created for DBCine...
DBCine docker not created, creating it...
604189afe3e4d652128b6351f967187bd8879b5c85f2d15fcbc28159bb12b0f1
..

Waiting for DBCine Docker will be ready.....DBCine container is running... creating database
Done.
```

Com veiem, primer crea el contenidor, i s'espera a que el procés de MySQL estiga preparat per crear les taules de la BD a dins. L'script de creació de la BD el teniu al mateix directori `database` i s'anomena *DBCine.sql*.

Les següents vegades que el posem en marxa, només engegarà el contenidor, amb la base de dades ja creada:

```
$ sudo ./createDockerDB.sh 
Checking for previous docker container created for DBCine...
DBCine container created yet, running it...
```

Per tal de comprovar que la BD està funcionant, podeu fer ús de `docker ps`:

```
$ sudo docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED       STATUS          PORTS                               NAMES
0d0b5b20b615   mysql     "docker-entrypoint.s…"   3 weeks ago   Up 19 seconds   33060/tcp, 0.0.0.0:3308->3306/tcp   mysqlCine
```

Com veiem, està utilitzant el port `3308` per fer visible el servei de MySQL a l'exterior, a través de la IP de la nostra màquina.

Per altra banda, si volem aturar el contenidor:

```
$ sudo docker stop mysqlCine
mysqlCine
```

I si volem eliminar-lo completament:

```
sudo docker rm mysqlCine
mysqlCine
```

Una vegada creat, ja podem accedir a la BD a través de:

* **Host**: 127.0.0.1
* **Port**: 3308
* **Usuari de la BD**: node
* **Contrassenya**: node
* **Base de dades**: 'cine'

## Posta en marxa l'exemple

Per tal d'executar l'exemple, abans que res cal instal·lar les dependències necessàries establertes al `package.json`. Per a això, farem, des de la carpeta arrel del projecte (la que conté el fitxer *package.json):

```
npm install
```

Que descarregarà electron, el connector de mysql i les llibreríes Bootstrap necessàries.

I després, posarem en marxa l'exemple amb:

```
npm start
```

