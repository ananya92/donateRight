DROP DATABASE IF EXISTS donateRight_db;
CREATE DATABASE donateRight_db;
USE donateRight_db;

CREATE TABLE user (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    phone_num INT AUTO_INCREMENT NOT NULL,
    email VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE charity (
    id INT AUTO_INCREMENT NOT NULL,
    charity_name VARCHAR(20) NOT NULL,
    phone_num INT AUTO_INCREMENT NOT NULL,
    email VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);