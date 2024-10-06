CREATE DATABASE IF NOT EXISTS db1004;

USE db1004;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email varchar(50),
  name varchar(50),
  password varchar(200)
);

INSERT INTO users (email, name, password) VALUES
('seokho@bootcamp.com', 'seokho', '1234'),
('jinyoung@bootcamp.com', 'jinyoung', '1234'),
('geonwook@bootcamp.com', 'geonwook', '1234');