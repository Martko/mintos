CREATE TABLE `daily_interests` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `source` varchar(50) DEFAULT NULL,
  `total` decimal(13,4) NOT NULL DEFAULT '0.0000',
  `loss` decimal(13,4) NOT NULL DEFAULT '0.0000',
  `net` decimal(13,4) NOT NULL DEFAULT '0.0000',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `portfolio_values` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `source` varchar(50) NOT NULL DEFAULT '',
  `value` decimal(13,4) NOT NULL,
  `initial_investment` decimal(13,4) NOT NULL DEFAULT '0.0000',
  `profit` decimal(13,4) NOT NULL DEFAULT '0.0000',
  `cash` decimal(13,4) NOT NULL DEFAULT '0.0000',
  `added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE VIEW `monthly_interests`
AS SELECT
   `daily_interests`.`source` AS `source`,month(`daily_interests`.`date`) AS `month`,year(`daily_interests`.`date`) AS `year`,sum(`daily_interests`.`total`) AS `total`,sum(`daily_interests`.`loss`) AS `loss`,sum(`daily_interests`.`net`) AS `net`
FROM `daily_interests` group by `daily_interests`.`source`,month(`daily_interests`.`date`),year(`daily_interests`.`date`);

CREATE VIEW `yearly_interests`
AS SELECT
   `daily_interests`.`source` AS `source`,year(`daily_interests`.`date`) AS `year`,sum(`daily_interests`.`total`) AS `total`,sum(`daily_interests`.`loss`) AS `loss`,sum(`daily_interests`.`net`) AS `net`
FROM `daily_interests` group by `daily_interests`.`source`,year(`daily_interests`.`date`);