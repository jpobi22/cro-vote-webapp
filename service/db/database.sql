SET foreign_key_checks = 0;

--
-- Table structure for table `author`
-- Add the sql statments for skeleton, example is below
--

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `author`
--

LOCK TABLES `user` WRITE;
INSERT INTO `user` VALUES (1,'Marin');
UNLOCK TABLES;

