CREATE TABLE `daily_interests` (
  `date` date NOT NULL,
  `source` varchar(50) DEFAULT NULL,
  `total` decimal(13,4) NOT NULL DEFAULT '0.0000',
  `loss` decimal(13,4) NOT NULL DEFAULT '0.0000',
  `net` decimal(13,4) NOT NULL DEFAULT '0.0000',
  PRIMARY KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `portfolio_values` (
  `date` date NOT NULL,
  `source` varchar(50) NOT NULL DEFAULT '',
  `value` float NOT NULL,
  PRIMARY KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE VIEW `monthly_interests`
AS SELECT
   `daily_interests`.`source` AS `source`,month(`daily_interests`.`date`) AS `month`,year(`daily_interests`.`date`) AS `year`,sum(`daily_interests`.`total`) AS `total`,sum(`daily_interests`.`loss`) AS `loss`,sum(`daily_interests`.`net`) AS `net`
FROM `daily_interests` group by `daily_interests`.`source`,month(`daily_interests`.`date`),year(`daily_interests`.`date`);

CREATE VIEW `yearly_interests`
AS SELECT
   `daily_interests`.`source` AS `source`,year(`daily_interests`.`date`) AS `year`,sum(`daily_interests`.`total`) AS `total`,sum(`daily_interests`.`loss`) AS `loss`,sum(`daily_interests`.`net`) AS `net`
FROM `daily_interests` group by `daily_interests`.`source`,year(`daily_interests`.`date`);