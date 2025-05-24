SET foreign_key_checks = 0;

DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `post`;
DROP TABLE IF EXISTS `user_post`;
DROP TABLE IF EXISTS `choices`;
DROP TABLE IF EXISTS `user_type`;

CREATE TABLE `cro_voting`.`post`(
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(1024) NOT NULL,
  `description` VARCHAR(2000) NOT NULL,
  `isActive` INTEGER,
  `isDeleted` DATETIME
);
CREATE TABLE `cro_voting`.`user_type`(
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(45) NOT NULL
);
CREATE TABLE `cro_voting`.`choices`(
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(1024) NOT NULL,
  `post_id` INTEGER NOT NULL,
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
  `choices_id` INTEGER,
  PRIMARY KEY(`post_id`,`user_oib`),
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
INSERT INTO post (id, name, description, isActive) VALUES (1, 'e673146baa48541bc0d55b5c7dec01c5:67887d01247ae015e363d38f47d8a985', '7b9575380f25b38a1f6e8f7fe23f8e06:3ecef3bd0cdca66f0396641359f7c3e9', 1);

INSERT INTO choices (id, name, post_id) VALUES
(1, 'd8391e80e329f17bc2599e08bc958034:d5573c0214567a548c0e64de8f54e962', 1),
(2, 'a7440cbc32308d3ad7a5711af19a8a2b:239a4eceb42963e5063a36db0275a4e7', 1),
(3, 'a6b742a0d39c2fb8188e68034da4eed8:28e9f31d628ea367f492ac2d5041651d', 1),
(4, 'ab3742223aa26a9378142826c02f7fc9:5c168dadc7d4927e52fb7920d40554c1e71e9d526e4a8af7536396df928bd21e', 1),
(5, 'd670047e7dd49222427fa897263678c0:ee82996c20764b98bd00b2e5802ac017db8ba5d5f66c7fa76b1f4d5f0e3aae0f', 1);
INSERT INTO user_post (user_oib, post_id, voted_time, choices_id)
VALUES
('12345678901', 1, NOW(), 1),
('00000000001', 1, NOW(), 3);

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
