-- load_schema.sql ------------------------

LOAD DATA LOCAL INFILE '../csv_files/Institutions.csv'
INTO TABLE institutions_main
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE '../csv_files/Programs.csv'
INTO TABLE programs_main
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE '../csv_files/Users.csv'
INTO TABLE users_main
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;