CREATE TABLE `daily_interests` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `source` varchar(50) DEFAULT NULL,
  `total` float NOT NULL DEFAULT '0',
  `loss` float NOT NULL DEFAULT '0',
  `net` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE VIEW `monthly_interests`
AS SELECT
   `daily_interests`.`source` AS `source`,month(`daily_interests`.`date`) AS `month`,year(`daily_interests`.`date`) AS `year`,sum(`daily_interests`.`total`) AS `total`,sum(`daily_interests`.`loss`) AS `loss`,sum(`daily_interests`.`net`) AS `net`
FROM `daily_interests` group by `daily_interests`.`source`,month(`daily_interests`.`date`),year(`daily_interests`.`date`);

CREATE VIEW `yearly_interests`
AS SELECT
   `daily_interests`.`source` AS `source`,year(`daily_interests`.`date`) AS `year`,sum(`daily_interests`.`total`) AS `total`,sum(`daily_interests`.`loss`) AS `loss`,sum(`daily_interests`.`net`) AS `net`
FROM `daily_interests` group by `daily_interests`.`source`,year(`daily_interests`.`date`);