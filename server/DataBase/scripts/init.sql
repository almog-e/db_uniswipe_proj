-- init.sql

-- Allow local infile for loading CSV files
SET GLOBAL local_infile = 1;

-- Drop and Create new DataBase if exists
DROP DATABASE IF EXISTS uniswipe;
CREATE DATABASE IF NOT EXISTS uniswipe;
USE uniswipe;

-- Create tables and load data
schema.sql;
tables.sql;
load_schema.sql;
load_tables.sql;
