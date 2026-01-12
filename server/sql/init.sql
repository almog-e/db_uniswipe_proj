-- Create database and universities table
CREATE DATABASE IF NOT EXISTS myapp;
USE myapp;

CREATE TABLE IF NOT EXISTS universities (
  uni_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  state VARCHAR(2),
  city VARCHAR(100),
  zip VARCHAR(20),
  public_private VARCHAR(50),
  admission_rate FLOAT,
  site_url VARCHAR(255),
  logo_url VARCHAR(255)
);

