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
  logo_url VARCHAR(255),
  country VARCHAR(100) DEFAULT 'USA',
  tagline VARCHAR(255),
  description TEXT,
  programs JSON
);

CREATE TABLE IF NOT EXISTS users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  gpa DECIMAL(3,2),
  sat_score INT,
  act_score INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS institutions (
  uni_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  state VARCHAR(2),
  city VARCHAR(100),
  zip VARCHAR(20),
  public_private VARCHAR(50),
  admission_rate FLOAT,
  site_url VARCHAR(255),
  logo_url VARCHAR(255),
  country VARCHAR(100) DEFAULT 'USA',
  tagline VARCHAR(255),
  description TEXT,
  programs JSON
);

