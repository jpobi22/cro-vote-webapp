SET foreign_key_checks = 0;

DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `post`;
DROP TABLE IF EXISTS `user_post`;
DROP TABLE IF EXISTS `choices`;
DROP TABLE IF EXISTS `user_type`;
CREATE TABLE `cro_voting`.`post`(
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(1000) NOT NULL
);
CREATE TABLE `cro_voting`.`user_type`(
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(45) NOT NULL
);
CREATE TABLE `cro_voting`.`choices`(
  `id` INTEGER NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `post_id` INTEGER NOT NULL,
  PRIMARY KEY(`id`,`post_id`),
  CONSTRAINT `fk_choices_post1`
    FOREIGN KEY(`post_id`)
    REFERENCES `post`(`id`)
);
CREATE TABLE `cro_voting`.`user`(
  `oib` VARCHAR(11) PRIMARY KEY NOT NULL,
  `id_user_type` INTEGER NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `surname` VARCHAR(45) NOT NULL,
  `address` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(13) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `TOTP_enabled` INTEGER NOT NULL,
  `TOTP_secret_key` VARCHAR(256) NOT NULL,
  `password` VARCHAR(256) NOT NULL,
  CONSTRAINT `fk_user_type`
    FOREIGN KEY(`id_user_type`)
    REFERENCES `user_type`(`id`)
);
CREATE TABLE `cro_voting`.`user_post`(
  `user_oib` VARCHAR(11) NOT NULL,
  `post_id` INTEGER NOT NULL,
  `voted_time` DATETIME,
  `user_postcol` VARCHAR(45),
  `choices_id` INTEGER NOT NULL,
  PRIMARY KEY(`post_id`,`user_oib`),
  CONSTRAINT `user_oib_UNIQUE`
    UNIQUE(`user_oib`),
  CONSTRAINT `post_id_UNIQUE`
    UNIQUE(`post_id`),
  CONSTRAINT `fk_user_post_user1`
    FOREIGN KEY(`user_oib`)
    REFERENCES `user`(`oib`),
  CONSTRAINT `fk_user_post_post1`
    FOREIGN KEY(`post_id`)
    REFERENCES `post`(`id`),
  CONSTRAINT `fk_user_post_choices1`
    FOREIGN KEY(`choices_id`)
    REFERENCES `choices`(`id`)
);

LOCK TABLES `user` WRITE, `post` WRITE, `user_type` WRITE, `user_post` WRITE, `choices` WRITE;


INSERT INTO user_type (id, name) VALUES (1, 'Admin'),(2, 'Voter');
INSERT INTO user (oib, id_user_type, name, surname, address, phone, email, TOTP_enabled, TOTP_secret_key, password)
VALUES ('12345678903', 2, 'Ana', 'Anić', 'Ulica 1, Zagreb', '0911234567', 'ana@me.com', 0, 'Not generated!', '$2b$10$jxyZd5pdKQolBvfnJJ7SB.PqPpzZe487G9Go.yZ/O1vKq0CzETZPG'),('00000000001', 1, 'Ivan', 'Ivić', 'Ulica 2, Split', '0922345678', 'peropetar12345678@gmail.com', 0, 'Not generated!', '$2b$10$jxyZd5pdKQolBvfnJJ7SB.PqPpzZe487G9Go.yZ/O1vKq0CzETZPG');
INSERT INTO post (id, name, description) VALUES (1, 'Glasanje za predsjednika države', 'Glasaj za svog kandidata.');
INSERT INTO choices (id, name, post_id) VALUES
(1, 'Franjo Tuđman', 2),
(2, 'Stjepan Mesić', 2),
(3, 'Ivo Josipović', 2),
(4, 'Kolinda Grabar-Kitarović', 1),
(5, 'Zoran Milanović', 1);
INSERT INTO user_post (user_oib, post_id, voted_time, user_postcol, choices_id)
VALUES
('12345678901', 1, NOW(), NULL, 1),
('23456789012', 2, NOW(), NULL, 3);
UNLOCK TABLES;

SELECT 
    u.oib,
    u.name AS user_name,
    u.surname AS user_surname,
    u.address,
    u.phone,
    u.email,
    ut.name AS user_type,
    p.name AS post_name,
    p.description AS post_description,
    c.name AS choice_name,
    up.voted_time
FROM 
    user u
JOIN 
    user_type ut ON u.id_user_type = ut.id
JOIN 
    user_post up ON u.oib = up.user_oib
JOIN 
    post p ON up.post_id = p.id
JOIN 
    choices c ON up.choices_id = c.id
ORDER BY 
    up.voted_time DESC;
