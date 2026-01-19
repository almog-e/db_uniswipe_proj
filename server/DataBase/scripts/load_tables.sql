-- load_tables.sql ------------------------------------

USE uniswipe;

-- institutions ---------------------------------------
INSERT INTO institutions (
    uni_id,
    name,
    state,
    city,
    zip,
    public_private,
    admission_rate,
    site_url,
    logo_url
)
SELECT UNITID, INSTNM, STABBR, CITY, ZIP, 
	CASE CONTROL
        WHEN 1 THEN 'Public'
        WHEN 2 THEN 'Private Nonprofit'
        WHEN 3 THEN 'Private For-Profit'
        ELSE 'Unknown'
    END,     
    NULLIF(ADM_RATE, 0),
    INSTURL,
    NULL
FROM institutions_main
WHERE CURROPER = 1 -- only currently operating institution
  AND STABBR IN (SELECT state_code FROM states);

-- programs ------------------------------------------------
INSERT INTO programs (cip_code, name)
SELECT DISTINCT CIPCODE, CIPDESC
FROM programs_main
WHERE CIPCODE IS NOT NULL;

-- institutions_programs -----------------------------------
INSERT INTO institutions_programs (uni_id, cip_code, degree_type)
SELECT p.UNITID, p.CIPCODE, p.CREDDESC
FROM programs_main p
JOIN institutions i
    ON p.UNITID = i.uni_id
WHERE p.CIPCODE IS NOT NULL;

-- admissions ----------------------------------------------
INSERT INTO admissions (uni_id, sat_avg, act_avg)
SELECT im.UNITID, im.SAT_AVG, im.ACTCMMID
FROM institutions_main im
JOIN institutions i
  ON im.UNITID = i.uni_id
WHERE im.SAT_AVG IS NOT NULL OR im.ACTCMMID IS NOT NULL;

-- program_outcomes -----------------------------------------
INSERT INTO program_outcomes (
    uni_prog_id,
    earn_1year,
    earn_2years,
    roi_score
)
SELECT
    ip.uni_prog_id,
    p.EARN_MDN_HI_1YR AS earn_1year,
    p.EARN_MDN_HI_2YR AS earn_2years,
    CASE
        WHEN p.EARN_MDN_HI_2YR IS NULL
          OR p.DEBT_ALL_STGP_EVAL_MEAN IS NULL
        THEN NULL
        ELSE ((p.EARN_MDN_HI_1YR / p.DEBT_ALL_STGP_EVAL_MEAN) * 100 )
    END AS roi_score
FROM programs_main p
JOIN institutions_programs ip
    ON p.UNITID = ip.uni_id
   AND p.CIPCODE = ip.cip_code
WHERE ip.uni_prog_id IS NOT NULL
  AND (p.EARN_MDN_HI_1YR IS NOT NULL 
       OR p.EARN_MDN_HI_2YR IS NOT NULL)
	AND (p.DEBT_ALL_STGP_EVAL_MEAN > 0);

-- users ---------------------------------------------------
INSERT INTO users (
	user_id, 
    name,
    email,
    password_hash,
    gpa,
    sat_score,
    act_score
)
SELECT id, name, email,'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', GPA, SAT, ACT
FROM users_main;


-- user_preference --------------------------------------
INSERT INTO user_preferences (
	user_id,
    preferred_region,
    preferred_degree_type,
    preferred_field_category,
    min_roi
)
SELECT id, state, preferred_degree_type, 'Computer Science.', min_ROI
FROM users_main;