SET foreign_key_checks = 0;

--
-- Table structure for table `author`
-- Add the sql statments for skeleton, example is below
--

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`idauthor`),
  UNIQUE KEY `idPisci_UNIQUE` (`idauthor`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `author`
--

LOCK TABLES `author` WRITE;
INSERT INTO `author` VALUES (1,'Mario Puzo'), ('2', 'F. Scott Fitzgerald'), ('3', 'Miguel de Cervantes'), ('4', 'Herman Melville'), ('5', 'Leo Tolstoy'), ('6', 'Fyodor Dostoevsky'), ('7', 'J. D. Salinger'), ('8', 'George Orwell'), ('9', 'Jane Austen'), ('10', 'Christian Church');
UNLOCK TABLES;

