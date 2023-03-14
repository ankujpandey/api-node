CREATE TABLE `person` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `mobile` varchar(10) NOT NULL,
  `email` varchar(200) NOT NULL,
  `pan` varchar(10) NOT NULL,
  `adhar` varchar(12) NOT NULL,
  PRIMARY KEY (`email`),
  UNIQUE KEY `id` (`id`)
)
