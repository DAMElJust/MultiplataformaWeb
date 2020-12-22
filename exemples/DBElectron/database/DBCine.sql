-- MySQL dump 10.13  Distrib 5.7.24, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: cine
-- ------------------------------------------------------
-- Server version	5.7.24-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Pelis`
--

drop schema if exists `cine`;

create schema `cine`;
use `cine`;

DROP TABLE IF EXISTS `Pelis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Pelis` (
  `idPelis` int(11) NOT NULL AUTO_INCREMENT,
  `Titol` varchar(45) NOT NULL,
  `Any` varchar(45) NOT NULL,
  `Director` varchar(45) NOT NULL,
  PRIMARY KEY (`idPelis`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pelis`
--

LOCK TABLES `Pelis` WRITE;
/*!40000 ALTER TABLE `Pelis` DISABLE KEYS */;
INSERT INTO `Pelis` VALUES (1,'La Amenaza Fantasma','1999','George Lucas'),(2,'El Ataque de los Clones','2002','George Lucas'),(3,'La Venganza de los Sith','2005','George Lucas'),(4,'Una Nueva Esperanza','1977','George Lucas'),(5,'El Imperio Contraataca','1980','George Lucas'),(6,'El Retorno del Jedi','1984','George Lucas'),(7,'El Despertar de la Fuerza','2015','J.J. Abrams'),(8,'Los Últimos Jedi','2017','Rian Johnson'),(9,'Rogue One: A Star Wars Story','2016','Gareth Edwards'),(10,'Solo: A Star Wars Story','2018','Ron Howard'),(11,'El Ascenso de Skywalker','2019','J.J. Abrams');
/*!40000 ALTER TABLE `Pelis` ENABLE KEYS */;
UNLOCK TABLES;

CREATE USER 'node'@'172.17.0.1' IDENTIFIED BY 'node';
GRANT ALL ON *.* TO 'node'@'172.17.0.1' WITH GRANT OPTION;
ALTER USER 'node'@'172.17.0.1' IDENTIFIED WITH mysql_native_password BY 'node';
FLUSH PRIVILEGES;

CREATE USER 'node'@'127.0.0.1' IDENTIFIED BY 'node';
GRANT ALL ON *.* TO 'node'@'127.0.0.1' WITH GRANT OPTION;
ALTER USER 'node'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY 'node';
FLUSH PRIVILEGES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-12-20 12:05:56
