-- init.sql

-- IN CMD:
-- mysql --local-infile=1 -u root -p < init.sql

-- Drop and Create new DataBase if exists
DROP DATABASE IF EXISTS uniswipe;
CREATE DATABASE IF NOT EXISTS uniswipe;
USE uniswipe;

-- Create tables and load data
schema.sql;
tables.sql;
load_schema.sql;
load_tables.sql;
