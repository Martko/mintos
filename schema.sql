# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.21)
# Database: investments
# Generation Time: 2019-04-09 16:11:30 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table daily_interests
# ------------------------------------------------------------

DROP TABLE IF EXISTS `daily_interests`;

CREATE TABLE `daily_interests` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `source` varchar(50) DEFAULT NULL,
  `total` float NOT NULL DEFAULT '0',
  `loss` float NOT NULL DEFAULT '0',
  `net` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


# Dump of table monthly_interests
# ------------------------------------------------------------

DROP VIEW IF EXISTS `monthly_interests`;

CREATE TABLE `monthly_interests` (
   `source` VARCHAR(50) NULL DEFAULT NULL,
   `month` INT(2) NULL DEFAULT NULL,
   `year` INT(4) NULL DEFAULT NULL,
   `total` DOUBLE NULL DEFAULT NULL,
   `loss` DOUBLE NULL DEFAULT NULL,
   `net` DOUBLE NULL DEFAULT NULL
) ENGINE=MyISAM;

# Dump of table yearly_interests
# ------------------------------------------------------------

DROP VIEW IF EXISTS `yearly_interests`;

CREATE TABLE `yearly_interests` (
   `source` VARCHAR(50) NULL DEFAULT NULL,
   `year` INT(4) NULL DEFAULT NULL,
   `total` DOUBLE NULL DEFAULT NULL,
   `loss` DOUBLE NULL DEFAULT NULL,
   `net` DOUBLE NULL DEFAULT NULL
) ENGINE=MyISAM;

# Replace placeholder table for monthly_interests with correct view syntax
# ------------------------------------------------------------

DROP TABLE `monthly_interests`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `monthly_interests`
AS SELECT
   `daily_interests`.`source` AS `source`,month(`daily_interests`.`date`) AS `month`,year(`daily_interests`.`date`) AS `year`,sum(`daily_interests`.`total`) AS `total`,sum(`daily_interests`.`loss`) AS `loss`,sum(`daily_interests`.`net`) AS `net`
FROM `daily_interests` group by `daily_interests`.`source`,month(`daily_interests`.`date`),year(`daily_interests`.`date`);


# Replace placeholder table for yearly_interests with correct view syntax
# ------------------------------------------------------------

DROP TABLE `yearly_interests`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `yearly_interests`
AS SELECT
   `daily_interests`.`source` AS `source`,year(`daily_interests`.`date`) AS `year`,sum(`daily_interests`.`total`) AS `total`,sum(`daily_interests`.`loss`) AS `loss`,sum(`daily_interests`.`net`) AS `net`
FROM `daily_interests` group by `daily_interests`.`source`,year(`daily_interests`.`date`);

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
