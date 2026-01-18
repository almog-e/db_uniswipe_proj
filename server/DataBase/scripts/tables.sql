-- tables.sql ------------------------------------
-- Create empty tables

USE uniswipe;

-- users -----------------------------------------------
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    gpa FLOAT,
    sat_score INT,
    act_score INT
);

-- users_preferences -----------------------------------------------
CREATE TABLE user_preferences (
    pref_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    preferred_region VARCHAR(100),
    preferred_degree_type VARCHAR(100),
    preferred_field_category VARCHAR(100),
    min_roi FLOAT,
    -- max_years_of_study INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
-- Create index
CREATE INDEX idx_pref_user ON user_preferences(user_id);

-- states ------------------------------------------------
CREATE TABLE states (
    state_code VARCHAR(2) PRIMARY KEY,
    state_name VARCHAR(50) NOT NULL
);

-- loading the data manually
INSERT INTO states (state_code, state_name) VALUES
('AL', 'Alabama'),
('AK', 'Alaska'),
('AZ', 'Arizona'),
('AR', 'Arkansas'),
('CA', 'California'),
('CO', 'Colorado'),
('CT', 'Connecticut'),
('DE', 'Delaware'),
('DC', 'District of Columbia'),
('FL', 'Florida'),
('GA', 'Georgia'),
('HI', 'Hawaii'),
('ID', 'Idaho'),
('IL', 'Illinois'),
('IN', 'Indiana'),
('IA', 'Iowa'),
('KS', 'Kansas'),
('KY', 'Kentucky'),
('LA', 'Louisiana'),
('ME', 'Maine'),
('MD', 'Maryland'),
('MA', 'Massachusetts'),
('MI', 'Michigan'),
('MN', 'Minnesota'),
('MS', 'Mississippi'),
('MO', 'Missouri'),
('MT', 'Montana'),
('NE', 'Nebraska'),
('NV', 'Nevada'),
('NH', 'New Hampshire'),
('NJ', 'New Jersey'),
('NM', 'New Mexico'),
('NY', 'New York'),
('NC', 'North Carolina'),
('ND', 'North Dakota'),
('OH', 'Ohio'),
('OK', 'Oklahoma'),
('OR', 'Oregon'),
('PA', 'Pennsylvania'),
('RI', 'Rhode Island'),
('SC', 'South Carolina'),
('SD', 'South Dakota'),
('TN', 'Tennessee'),
('TX', 'Texas'),
('UT', 'Utah'),
('VT', 'Vermont'),
('VA', 'Virginia'),
('WA', 'Washington'),
('WV', 'West Virginia'),
('WI', 'Wisconsin'),
('WY', 'Wyoming');

-- institutions ---------------------------------------------------
CREATE TABLE institutions (
    uni_id INT PRIMARY KEY,
    name VARCHAR(255),
    state VARCHAR(2), -- Do we need to change to actual state name or just code? if we do - another table/column?
    city VARCHAR(100),
    zip VARCHAR(20),
    public_private VARCHAR(50),
    admission_rate FLOAT,
    site_url VARCHAR(255),
    logo_url VARCHAR(255),
    FOREIGN KEY (state) REFERENCES states(state_code)
);
-- Create index
CREATE INDEX idx_inst_state ON institutions(state);

-- programs ---------------------------------------------------------
CREATE TABLE programs (
    cip_code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255)
);

-- institutions_programs ---------------------------------------------
CREATE TABLE institutions_programs (
    uni_prog_id INT AUTO_INCREMENT PRIMARY KEY,
    uni_id INT NOT NULL,
    cip_code VARCHAR(50) NOT NULL,
    degree_type VARCHAR(100),
    FOREIGN KEY (uni_id) REFERENCES institutions(uni_id),
    FOREIGN KEY (cip_code) REFERENCES programs(cip_code),
    UNIQUE (uni_id, cip_code)
);
-- Create index
CREATE INDEX idx_ip_cip ON institutions_programs(cip_code);
    
-- admissions ----------------------------------------------------------
CREATE TABLE admissions (
    admission_id INT AUTO_INCREMENT PRIMARY KEY,
    uni_id INT,
    sat_avg INT,
    act_avg INT,
    FOREIGN KEY (uni_id) REFERENCES institutions(uni_id)
);
-- Create index
CREATE INDEX idx_adm_uni ON admissions(uni_id);

-- program_outcomes -------------------------------------------------
CREATE TABLE program_outcomes (
    outcome_id INT AUTO_INCREMENT PRIMARY KEY,
    uni_prog_id INT NOT NULL,
    earn_1year INT,
    earn_2years INT,
    roi_score FLOAT,
    FOREIGN KEY (uni_prog_id) REFERENCES institutions_programs(uni_prog_id)
);
-- Create index
CREATE INDEX idx_po_uni_prog ON program_outcomes(uni_prog_id);
CREATE INDEX idx_po_roi ON program_outcomes(roi_score);

